import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerMinutesTools(server: McpServer, db: D1Client) {
  server.tool(
    "minutes_list",
    "List meeting minutes for a lodge, ordered by date descending",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      include_unpublished: z.boolean().optional().default(false),
    },
    async ({ lodge_slug, include_unpublished }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const publishedClause = include_unpublished ? "" : "AND published = 1";
      const rows = await db.all(
        `SELECT * FROM meeting_minutes WHERE lodge_id = ? ${publishedClause} ORDER BY meeting_date DESC`,
        [lodgeId],
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "minutes_get",
    "Get a single meeting minutes entry by ID",
    { id: z.number().describe("Minutes ID") },
    async ({ id }) => {
      const row = await db.first(
        "SELECT * FROM meeting_minutes WHERE id = ?",
        [id],
      );
      if (!row) {
        return { content: [{ type: "text", text: "Minutes not found." }], isError: true };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      };
    },
  );

  server.tool(
    "minutes_create",
    "Add meeting minutes for a lodge. Content is Markdown.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      meeting_date: z.string().describe("ISO date of the meeting, e.g. '2025-03-15'"),
      content: z.string().describe("Minutes content in Markdown"),
      title: z.string().optional().describe("Optional title (defaults to 'Meeting Minutes')"),
      published: z.boolean().optional().default(true),
    },
    async ({ lodge_slug, meeting_date, content, title, published }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO meeting_minutes (lodge_id, meeting_date, title, content, published)
         VALUES (?, ?, ?, ?, ?)`,
        [lodgeId, meeting_date, title ?? null, content, published ? 1 : 0],
      );
      return {
        content: [
          {
            type: "text",
            text: `Minutes created (ID: ${meta.last_row_id}) for ${meeting_date} in lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "minutes_update",
    "Update meeting minutes by ID",
    {
      id: z.number(),
      meeting_date: z.string().optional(),
      title: z.string().optional(),
      content: z.string().optional(),
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
        `UPDATE meeting_minutes SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
      return {
        content: [{ type: "text", text: `Minutes ${id} updated.` }],
      };
    },
  );

  server.tool(
    "minutes_delete",
    "Delete meeting minutes by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM meeting_minutes WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Minutes ${id} deleted.` }],
      };
    },
  );
}
