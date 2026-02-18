import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerAnnouncementTools(server: McpServer, db: D1Client) {
  server.tool(
    "announcement_list",
    "List announcements for a lodge. By default shows only active (published & not expired) announcements.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      include_all: z.boolean().optional().default(false).describe("Include drafts and expired announcements"),
    },
    async ({ lodge_slug, include_all }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      let where = "WHERE lodge_id = ?";
      const params: (string | number)[] = [lodgeId];
      if (!include_all) {
        where += " AND published = 1 AND (expires_at IS NULL OR expires_at >= date('now'))";
      }
      const rows = await db.all(
        `SELECT * FROM lodge_announcements ${where} ORDER BY created_at DESC`,
        params,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "announcement_get",
    "Get a single announcement by ID",
    { id: z.number().describe("Announcement ID") },
    async ({ id }) => {
      const row = await db.first(
        "SELECT * FROM lodge_announcements WHERE id = ?",
        [id],
      );
      if (!row) {
        return { content: [{ type: "text", text: "Announcement not found." }], isError: true };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      };
    },
  );

  server.tool(
    "announcement_create",
    "Create a new announcement for a lodge. Content is Markdown.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      title: z.string(),
      content: z.string().describe("Announcement body in Markdown"),
      expires_at: z.string().optional().describe("ISO date when the announcement expires"),
      published: z.boolean().optional().default(true),
    },
    async ({ lodge_slug, title, content, expires_at, published }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO lodge_announcements (lodge_id, title, content, expires_at, published)
         VALUES (?, ?, ?, ?, ?)`,
        [lodgeId, title, content, expires_at ?? null, published ? 1 : 0],
      );
      return {
        content: [
          {
            type: "text",
            text: `Announcement created (ID: ${meta.last_row_id}): "${title}" for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "announcement_update",
    "Update an announcement by ID",
    {
      id: z.number(),
      title: z.string().optional(),
      content: z.string().optional(),
      expires_at: z.string().optional(),
      published: z.boolean().optional(),
    },
    async ({ id, published, ...fields }) => {
      const updates: string[] = [];
      const params: (string | number | null)[] = [];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value as string);
        }
      }
      if (published !== undefined) {
        updates.push("published = ?");
        params.push(published ? 1 : 0);
      }
      if (updates.length === 0) {
        return { content: [{ type: "text", text: "No updates provided." }] };
      }
      params.push(id);

      await db.run(
        `UPDATE lodge_announcements SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
      return {
        content: [{ type: "text", text: `Announcement ${id} updated.` }],
      };
    },
  );

  server.tool(
    "announcement_delete",
    "Delete an announcement by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM lodge_announcements WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Announcement ${id} deleted.` }],
      };
    },
  );
}
