import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerOfficerTools(server: McpServer, db: D1Client) {
  server.tool(
    "officers_list",
    "List all current officers for a lodge in display order",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      include_inactive: z.boolean().optional().default(false),
    },
    async ({ lodge_slug, include_inactive }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const activeClause = include_inactive ? "" : "AND active = 1";
      const rows = await db.all(
        `SELECT * FROM officers WHERE lodge_id = ? ${activeClause} ORDER BY display_order ASC, id ASC`,
        [lodgeId],
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "officer_create",
    "Add a lodge officer",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      title: z.string().describe("Officer title, e.g. 'Chancellor Commander'"),
      name: z.string().describe("Officer's full name"),
      email: z.string().optional(),
      display_order: z.number().optional().default(0).describe("Sort order (lower = first)"),
    },
    async ({ lodge_slug, title, name, email, display_order }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        "INSERT INTO officers (lodge_id, title, name, email, display_order) VALUES (?, ?, ?, ?, ?)",
        [lodgeId, title, name, email ?? null, display_order],
      );
      return {
        content: [
          {
            type: "text",
            text: `Officer created (ID: ${meta.last_row_id}): ${title} – ${name} for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "officer_update",
    "Update an officer by ID",
    {
      id: z.number(),
      title: z.string().optional(),
      name: z.string().optional(),
      email: z.string().optional(),
      display_order: z.number().optional(),
      active: z.boolean().optional(),
    },
    async ({ id, active, ...fields }) => {
      const now = new Date().toISOString();
      const updates: string[] = ["updated_at = ?"];
      const params: (string | number | null)[] = [now];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value as string | number);
        }
      }
      if (active !== undefined) {
        updates.push("active = ?");
        params.push(active ? 1 : 0);
      }
      params.push(id);

      await db.run(`UPDATE officers SET ${updates.join(", ")} WHERE id = ?`, params);
      return {
        content: [{ type: "text", text: `Officer ${id} updated.` }],
      };
    },
  );

  server.tool(
    "officers_replace",
    "Replace the entire officer roster for a lodge. Useful at start of a new year. Existing officers are marked inactive; new roster is inserted.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      officers: z
        .array(
          z.object({
            title: z.string(),
            name: z.string(),
            email: z.string().optional(),
          }),
        )
        .describe("Ordered list of officers (index = display_order)"),
    },
    async ({ lodge_slug, officers }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const now = new Date().toISOString();
      await db.run("UPDATE officers SET active = 0, updated_at = ? WHERE lodge_id = ?", [now, lodgeId]);
      for (let i = 0; i < officers.length; i++) {
        const { title, name, email } = officers[i];
        await db.run(
          "INSERT INTO officers (lodge_id, title, name, email, display_order, active, updated_at) VALUES (?, ?, ?, ?, ?, 1, ?)",
          [lodgeId, title, name, email ?? null, i, now],
        );
      }
      return {
        content: [
          {
            type: "text",
            text: `Officer roster for lodge '${lodge_slug}' replaced with ${officers.length} officer(s).`,
          },
        ],
      };
    },
  );
}
