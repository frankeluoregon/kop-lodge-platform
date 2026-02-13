import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerCommunityServiceTools(server: McpServer, db: D1Client) {
  server.tool(
    "community_service_list",
    "List community service showcase entries for a lodge",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      featured_only: z.boolean().optional().default(false),
      include_unpublished: z.boolean().optional().default(false),
      limit: z.number().optional().default(20),
    },
    async ({ lodge_slug, featured_only, include_unpublished, limit }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const conditions: string[] = ["lodge_id = ?"];
      const params: (string | number)[] = [lodgeId];
      if (featured_only) conditions.push("featured = 1");
      if (!include_unpublished) conditions.push("published = 1");
      const where = `WHERE ${conditions.join(" AND ")}`;
      const rows = await db.all(
        `SELECT * FROM community_service ${where}
         ORDER BY COALESCE(service_date, created_at) DESC
         LIMIT ?`,
        [...params, limit],
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "community_service_create",
    "Add a community service entry to a lodge's showcase. Description supports Markdown.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      title: z.string(),
      description: z.string().describe("Description in Markdown"),
      service_date: z
        .string()
        .optional()
        .describe("Date of the service activity (ISO 8601)"),
      featured: z
        .boolean()
        .optional()
        .default(false)
        .describe("Show prominently on homepage/featured section"),
      published: z.boolean().optional().default(true),
    },
    async ({ lodge_slug, title, description, service_date, featured, published }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO community_service (lodge_id, title, description, service_date, featured, published)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [lodgeId, title, description, service_date ?? null, featured ? 1 : 0, published ? 1 : 0],
      );
      return {
        content: [
          {
            type: "text",
            text: `Community service entry created (ID: ${meta.last_row_id}): "${title}" for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "community_service_update",
    "Update a community service entry by ID",
    {
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      service_date: z.string().optional(),
      featured: z.boolean().optional(),
      published: z.boolean().optional(),
    },
    async ({ id, featured, published, ...fields }) => {
      const now = new Date().toISOString();
      const updates: string[] = ["updated_at = ?"];
      const params: (string | number | null)[] = [now];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value as string);
        }
      }
      if (featured !== undefined) {
        updates.push("featured = ?");
        params.push(featured ? 1 : 0);
      }
      if (published !== undefined) {
        updates.push("published = ?");
        params.push(published ? 1 : 0);
      }
      params.push(id);

      await db.run(
        `UPDATE community_service SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
      return {
        content: [{ type: "text", text: `Community service entry ${id} updated.` }],
      };
    },
  );

  server.tool(
    "community_service_delete",
    "Delete a community service entry by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM community_service WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Community service entry ${id} deleted.` }],
      };
    },
  );
}
