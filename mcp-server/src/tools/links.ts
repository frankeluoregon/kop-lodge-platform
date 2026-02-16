import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerLinksTools(server: McpServer, db: D1Client) {
  server.tool(
    "links_list",
    "List external links for a lodge, optionally filtered by category",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      category: z.string().optional().describe("Filter by category (e.g. 'pythian', 'community', 'general')"),
    },
    async ({ lodge_slug, category }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const where = category
        ? "WHERE lodge_id = ? AND category = ?"
        : "WHERE lodge_id = ?";
      const params = category ? [lodgeId, category] : [lodgeId];
      const rows = await db.all(
        `SELECT * FROM links ${where} ORDER BY category ASC, display_order ASC, title ASC`,
        params,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "link_create",
    "Add an external link to a lodge's links page",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      title: z.string().describe("Display title for the link"),
      url: z.string().describe("Full URL"),
      category: z.string().optional().default("general").describe("Category: 'general', 'pythian', 'community', etc."),
      description: z.string().optional().describe("Brief description of the link"),
      display_order: z.number().optional().default(0),
    },
    async ({ lodge_slug, title, url, category, description, display_order }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO links (lodge_id, title, url, category, description, display_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [lodgeId, title, url, category, description ?? null, display_order],
      );
      return {
        content: [
          {
            type: "text",
            text: `Link created (ID: ${meta.last_row_id}): "${title}" for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "link_update",
    "Update a link by ID",
    {
      id: z.number(),
      title: z.string().optional(),
      url: z.string().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
      display_order: z.number().optional(),
    },
    async ({ id, ...fields }) => {
      const updates: string[] = [];
      const params: (string | number | null)[] = [];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value as string | number);
        }
      }
      if (updates.length === 0) {
        return { content: [{ type: "text", text: "No updates provided." }] };
      }
      params.push(id);

      await db.run(
        `UPDATE links SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
      return {
        content: [{ type: "text", text: `Link ${id} updated.` }],
      };
    },
  );

  server.tool(
    "link_delete",
    "Delete a link by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM links WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Link ${id} deleted.` }],
      };
    },
  );
}
