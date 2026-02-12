import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";

interface Page {
  slug: string;
  title: string;
  content: string;
  meta_description: string | null;
  updated_at: string;
}

export function registerPageTools(server: McpServer, db: D1Client) {
  server.tool(
    "page_list",
    "List all pages on the lodge website",
    {},
    async () => {
      const rows = await db.all<Page>(
        "SELECT slug, title, meta_description, updated_at FROM pages ORDER BY slug",
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "page_get",
    "Get the full content of a page by slug (e.g. 'about', 'contact')",
    { slug: z.string().describe("Page slug") },
    async ({ slug }) => {
      const page = await db.first<Page>(
        "SELECT * FROM pages WHERE slug = ?",
        [slug],
      );
      if (!page) {
        return {
          content: [{ type: "text", text: `Page '${slug}' not found.` }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(page, null, 2) }],
      };
    },
  );

  server.tool(
    "page_upsert",
    "Create or update a page. Content is Markdown.",
    {
      slug: z.string().describe("URL-safe page identifier (e.g. 'about')"),
      title: z.string().describe("Page title"),
      content: z.string().describe("Page body in Markdown"),
      meta_description: z
        .string()
        .optional()
        .describe("Short SEO description (≤160 chars)"),
    },
    async ({ slug, title, content, meta_description }) => {
      const now = new Date().toISOString();
      await db.run(
        `INSERT INTO pages (slug, title, content, meta_description, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           title=excluded.title,
           content=excluded.content,
           meta_description=excluded.meta_description,
           updated_at=excluded.updated_at`,
        [slug, title, content, meta_description ?? null, now],
      );
      return {
        content: [{ type: "text", text: `Page '${slug}' saved successfully.` }],
      };
    },
  );

  server.tool(
    "page_delete",
    "Delete a page by slug",
    { slug: z.string() },
    async ({ slug }) => {
      await db.run("DELETE FROM pages WHERE slug = ?", [slug]);
      return {
        content: [{ type: "text", text: `Page '${slug}' deleted.` }],
      };
    },
  );
}
