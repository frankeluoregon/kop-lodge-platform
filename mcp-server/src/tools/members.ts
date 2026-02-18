import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerMemberTools(server: McpServer, db: D1Client) {
  server.tool(
    "member_list",
    "List members for a lodge. Defaults to active members only.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      include_inactive: z.boolean().optional().default(false),
    },
    async ({ lodge_slug, include_inactive }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const activeClause = include_inactive ? "" : "AND active = 1";
      const rows = await db.all(
        `SELECT * FROM lodge_members WHERE lodge_id = ? ${activeClause} ORDER BY active DESC, name ASC`,
        [lodgeId],
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "member_get",
    "Get a single member by ID",
    { id: z.number().describe("Member ID") },
    async ({ id }) => {
      const row = await db.first(
        "SELECT * FROM lodge_members WHERE id = ?",
        [id],
      );
      if (!row) {
        return { content: [{ type: "text", text: "Member not found." }], isError: true };
      }
      return {
        content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      };
    },
  );

  server.tool(
    "member_create",
    "Add a member to a lodge roster",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      name: z.string().describe("Member's full name"),
      email: z.string().optional(),
      phone: z.string().optional(),
      degree: z.number().optional().default(1).describe("1=Page, 2=Esquire, 3=Knight"),
      office: z.string().optional().describe("Lodge office held, if any"),
      joined_date: z.string().optional().describe("ISO date of joining"),
      notes: z.string().optional(),
    },
    async ({ lodge_slug, name, email, phone, degree, office, joined_date, notes }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO lodge_members (lodge_id, name, email, phone, degree, office, joined_date, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [lodgeId, name, email ?? null, phone ?? null, degree, office ?? null, joined_date ?? null, notes ?? null],
      );
      return {
        content: [
          {
            type: "text",
            text: `Member created (ID: ${meta.last_row_id}): ${name} for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "member_update",
    "Update a member by ID",
    {
      id: z.number(),
      name: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      degree: z.number().optional(),
      office: z.string().optional(),
      joined_date: z.string().optional(),
      active: z.boolean().optional(),
      notes: z.string().optional(),
    },
    async ({ id, active, ...fields }) => {
      const updates: string[] = [];
      const params: (string | number | null)[] = [];

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
      if (updates.length === 0) {
        return { content: [{ type: "text", text: "No updates provided." }] };
      }
      params.push(id);

      await db.run(
        `UPDATE lodge_members SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
      return {
        content: [{ type: "text", text: `Member ${id} updated.` }],
      };
    },
  );

  server.tool(
    "member_delete",
    "Permanently delete a member by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM lodge_members WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Member ${id} deleted.` }],
      };
    },
  );
}
