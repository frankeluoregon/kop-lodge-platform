import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function registerBlogTools(server: McpServer, db: D1Client) {
  server.tool(
    "blog_list",
    "List blog posts. Defaults to published posts only.",
    {
      include_drafts: z.boolean().optional().default(false),
      limit: z.number().optional().default(20),
    },
    async ({ include_drafts, limit }) => {
      const where = include_drafts ? "" : "WHERE published = 1";
      const rows = await db.all(
        `SELECT id, slug, title, excerpt, author, published, published_at, updated_at
         FROM blog_posts ${where}
         ORDER BY COALESCE(published_at, created_at) DESC
         LIMIT ?`,
        [limit],
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "blog_get",
    "Get the full content of a blog post by slug or ID",
    {
      slug: z.string().optional(),
      id: z.number().optional(),
    },
    async ({ slug, id }) => {
      if (!slug && !id) {
        return {
          content: [{ type: "text", text: "Provide either slug or id." }],
          isError: true,
        };
      }
      const row = slug
        ? await db.first("SELECT * FROM blog_posts WHERE slug = ?", [slug])
        : await db.first("SELECT * FROM blog_posts WHERE id = ?", [id!]);

      if (!row) {
        return {
          content: [{ type: "text", text: "Post not found." }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      };
    },
  );

  server.tool(
    "blog_create",
    "Create a new blog post (saved as draft by default). Content is Markdown.",
    {
      title: z.string(),
      content: z.string().describe("Post body in Markdown"),
      excerpt: z.string().optional().describe("Short summary shown in listings"),
      author: z.string().optional(),
      slug: z.string().optional().describe("URL slug; auto-generated from title if omitted"),
      publish: z.boolean().optional().default(false).describe("Publish immediately"),
    },
    async ({ title, content, excerpt, author, slug, publish }) => {
      const finalSlug = slug ?? slugify(title);
      const now = new Date().toISOString();
      const meta = await db.run(
        `INSERT INTO blog_posts (slug, title, content, excerpt, author, published, published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalSlug,
          title,
          content,
          excerpt ?? null,
          author ?? null,
          publish ? 1 : 0,
          publish ? now : null,
          now,
          now,
        ],
      );
      return {
        content: [
          {
            type: "text",
            text: `Blog post created (ID: ${meta.last_row_id}, slug: "${finalSlug}", ${publish ? "published" : "draft"}).`,
          },
        ],
      };
    },
  );

  server.tool(
    "blog_update",
    "Update an existing blog post by ID",
    {
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      author: z.string().optional(),
      slug: z.string().optional(),
      published: z.boolean().optional(),
    },
    async ({ id, published, ...fields }) => {
      const now = new Date().toISOString();
      const updates: string[] = ["updated_at = ?"];
      const params: (string | number | null)[] = [now];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value as string);
        }
      }
      if (published !== undefined) {
        updates.push("published = ?");
        params.push(published ? 1 : 0);
        if (published) {
          updates.push("published_at = COALESCE(published_at, ?)");
          params.push(now);
        }
      }
      params.push(id);

      await db.run(`UPDATE blog_posts SET ${updates.join(", ")} WHERE id = ?`, params);
      return {
        content: [{ type: "text", text: `Blog post ${id} updated.` }],
      };
    },
  );

  server.tool(
    "blog_delete",
    "Permanently delete a blog post by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM blog_posts WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Blog post ${id} deleted.` }],
      };
    },
  );
}
