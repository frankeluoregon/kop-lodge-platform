import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerGalleryTools(server: McpServer, db: D1Client) {
  server.tool(
    "gallery_list",
    "List photo gallery entries for a lodge",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      include_unpublished: z.boolean().optional().default(false),
    },
    async ({ lodge_slug, include_unpublished }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const where = include_unpublished
        ? "WHERE lodge_id = ?"
        : "WHERE lodge_id = ? AND published = 1";
      const rows = await db.all(
        `SELECT * FROM gallery_photos ${where} ORDER BY display_order ASC, id DESC`,
        [lodgeId],
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "gallery_create",
    "Add a photo to a lodge's gallery",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      image_key: z.string().describe("R2 object key for the image"),
      caption: z.string().optional(),
      display_order: z.number().optional().default(0),
      published: z.boolean().optional().default(true),
    },
    async ({ lodge_slug, image_key, caption, display_order, published }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO gallery_photos (lodge_id, image_key, caption, display_order, published)
         VALUES (?, ?, ?, ?, ?)`,
        [lodgeId, image_key, caption ?? null, display_order, published ? 1 : 0],
      );
      return {
        content: [
          {
            type: "text",
            text: `Gallery photo created (ID: ${meta.last_row_id}) for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "gallery_update",
    "Update a gallery photo entry by ID",
    {
      id: z.number(),
      image_key: z.string().optional(),
      caption: z.string().optional(),
      display_order: z.number().optional(),
      published: z.boolean().optional(),
    },
    async ({ id, published, ...fields }) => {
      const updates: string[] = [];
      const params: (string | number | null)[] = [];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(value as string | number);
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
        `UPDATE gallery_photos SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
      return {
        content: [{ type: "text", text: `Gallery photo ${id} updated.` }],
      };
    },
  );

  server.tool(
    "gallery_delete",
    "Delete a gallery photo by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM gallery_photos WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Gallery photo ${id} deleted.` }],
      };
    },
  );
}
