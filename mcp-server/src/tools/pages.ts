import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

interface Page {
  id: number;
  lodge_id: number;
  slug: string;
  title: string;
  content: string;
  meta_description: string | null;
  updated_at: string;
}

export function registerPageTools(server: McpServer, db: D1Client) {
  server.tool(
    "page_list",
    "List all custom pages for a lodge",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
    },
    async ({ lodge_slug }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const rows = await db.all<Page>(
        "SELECT id, slug, title, meta_description, updated_at FROM pages WHERE lodge_id = ? ORDER BY slug",
        [lodgeId],
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "page_get",
    "Get the full content of a page for a lodge by slug (e.g. 'about', 'contact')",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      slug: z.string().describe("Page slug"),
    },
    async ({ lodge_slug, slug }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const page = await db.first<Page>(
        "SELECT * FROM pages WHERE lodge_id = ? AND slug = ?",
        [lodgeId, slug],
      );
      if (!page) {
        return {
          content: [{ type: "text", text: `Page '${slug}' not found for lodge '${lodge_slug}'.` }],
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
    "Create or update a custom page for a lodge. Content is Markdown.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      slug: z.string().describe("URL-safe page identifier (e.g. 'about')"),
      title: z.string().describe("Page title"),
      content: z.string().describe("Page body in Markdown"),
      meta_description: z
        .string()
        .optional()
        .describe("Short SEO description (≤160 chars)"),
    },
    async ({ lodge_slug, slug, title, content, meta_description }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const now = new Date().toISOString();
      await db.run(
        `INSERT INTO pages (lodge_id, slug, title, content, meta_description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(lodge_id, slug) DO UPDATE SET
           title=excluded.title,
           content=excluded.content,
           meta_description=excluded.meta_description,
           updated_at=excluded.updated_at`,
        [lodgeId, slug, title, content, meta_description ?? null, now, now],
      );
      return {
        content: [{ type: "text", text: `Page '${slug}' saved for lodge '${lodge_slug}'.` }],
      };
    },
  );

  server.tool(
    "page_delete",
    "Delete a custom page by slug for a lodge",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      slug: z.string(),
    },
    async ({ lodge_slug, slug }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      await db.run("DELETE FROM pages WHERE lodge_id = ? AND slug = ?", [lodgeId, slug]);
      return {
        content: [{ type: "text", text: `Page '${slug}' deleted for lodge '${lodge_slug}'.` }],
      };
    },
  );
}
