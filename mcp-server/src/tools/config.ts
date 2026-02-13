import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";
import { getLodgeId } from "../db/client.js";

export function registerConfigTools(server: McpServer, db: D1Client) {
  server.tool(
    "config_get",
    "Get all configuration values for a lodge (name, number, location, colors, etc.)",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1' or 'phoenix-34'"),
    },
    async ({ lodge_slug }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const rows = await db.all<{ key: string; value: string }>(
        "SELECT key, value FROM lodge_config WHERE lodge_id = ? ORDER BY key",
        [lodgeId],
      );
      const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      return {
        content: [{ type: "text", text: JSON.stringify(config, null, 2) }],
      };
    },
  );

  server.tool(
    "config_set",
    "Update one or more configuration values for a lodge",
    {
      lodge_slug: z.string().describe("Lodge slug, e.g. 'ivanhoe-1'"),
      updates: z
        .record(z.string(), z.string())
        .describe(
          "Key-value pairs to update. Valid keys: lodge_name, lodge_number, state, grand_domain, city, meeting_schedule, meeting_location, phone, email, facebook_url, primary_color, accent_color, tagline, founded_year, logo_key",
        ),
    },
    async ({ lodge_slug, updates }) => {
      const lodgeId = await getLodgeId(db, lodge_slug);
      const now = new Date().toISOString();
      const entries = Object.entries(updates);
      for (const [key, value] of entries) {
        await db.run(
          "INSERT INTO lodge_config (lodge_id, key, value, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(lodge_id, key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at",
          [lodgeId, key, value, now],
        );
      }
      return {
        content: [
          {
            type: "text",
            text: `Updated ${entries.length} config value(s) for lodge '${lodge_slug}': ${entries.map(([k]) => k).join(", ")}`,
          },
        ],
      };
    },
  );
}
