import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

const EventLevel = z.enum(["lodge", "grand", "supreme"]);

interface Event {
  id: number;
  lodge_id: number;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  level: string;
  url: string | null;
  image_key: string | null;
  published: number;
  created_at: string;
  updated_at: string;
}

export function registerEventTools(server: McpServer, db: D1Client) {
  server.tool(
    "event_list",
    "List events for a lodge. Optionally filter by level (lodge/grand/supreme) and whether to include past events.",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      level: EventLevel.optional().describe("Filter by lodge, grand, or supreme"),
      include_past: z
        .boolean()
        .optional()
        .default(false)
        .describe("Include events that have already occurred"),
      published_only: z.boolean().optional().default(true),
    },
    async ({ lodge_slug, level, include_past, published_only }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const conditions: string[] = ["lodge_id = ?"];
      const params: (string | number)[] = [lodgeId];

      if (level) {
        conditions.push("level = ?");
        params.push(level);
      }
      if (!include_past) {
        conditions.push("event_date >= date('now')");
      }
      if (published_only) {
        conditions.push("published = 1");
      }

      const where = `WHERE ${conditions.join(" AND ")}`;
      const rows = await db.all<Event>(
        `SELECT * FROM events ${where} ORDER BY event_date ASC`,
        params,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "event_create",
    "Add a new event to a lodge calendar",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      title: z.string(),
      event_date: z.string().describe("ISO 8601 date, e.g. 2025-03-15 or 2025-03-15T19:00"),
      level: EventLevel.describe("lodge = local, grand = state, supreme = national"),
      description: z.string().optional(),
      end_date: z.string().optional().describe("ISO 8601 end date/time"),
      location: z.string().optional(),
      url: z.string().optional().describe("External link for more info"),
      published: z.boolean().optional().default(true),
    },
    async ({ lodge_slug, title, event_date, level, description, end_date, location, url, published }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const meta = await db.run(
        `INSERT INTO events (lodge_id, title, event_date, level, description, end_date, location, url, published)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lodgeId,
          title,
          event_date,
          level,
          description ?? null,
          end_date ?? null,
          location ?? null,
          url ?? null,
          published ? 1 : 0,
        ],
      );
      return {
        content: [
          {
            type: "text",
            text: `Event created with ID ${meta.last_row_id}: "${title}" for lodge '${lodge_slug}'`,
          },
        ],
      };
    },
  );

  server.tool(
    "event_update",
    "Update an existing event by ID",
    {
      id: z.number().describe("Event ID"),
      title: z.string().optional(),
      event_date: z.string().optional(),
      level: EventLevel.optional(),
      description: z.string().optional(),
      end_date: z.string().optional(),
      location: z.string().optional(),
      url: z.string().optional(),
      published: z.boolean().optional(),
    },
    async ({ id, ...fields }) => {
      const now = new Date().toISOString();
      const updates: string[] = ["updated_at = ?"];
      const params: (string | number | null)[] = [now];

      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          params.push(key === "published" ? (value ? 1 : 0) : (value as string | null));
        }
      }
      params.push(id);

      await db.run(
        `UPDATE events SET ${updates.join(", ")} WHERE id = ?`,
        params,
      );
      return {
        content: [{ type: "text", text: `Event ${id} updated.` }],
      };
    },
  );

  server.tool(
    "event_delete",
    "Delete an event by ID",
    { id: z.number() },
    async ({ id }) => {
      await db.run("DELETE FROM events WHERE id = ?", [id]);
      return {
        content: [{ type: "text", text: `Event ${id} deleted.` }],
      };
    },
  );
}
