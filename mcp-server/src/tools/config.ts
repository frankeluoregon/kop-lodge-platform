import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";

export function registerConfigTools(server: McpServer, db: D1Client) {
  server.tool(
    "config_get",
    "Get all lodge configuration values (name, number, location, colors, etc.)",
    {},
    async () => {
      const rows = await db.all<{ key: string; value: string }>(
        "SELECT key, value FROM lodge_config ORDER BY key",
      );
      const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      return {
        content: [{ type: "text", text: JSON.stringify(config, null, 2) }],
      };
    },
  );

  server.tool(
    "config_set",
    "Update one or more lodge configuration values",
    {
      updates: z
        .record(z.string())
        .describe(
          "Key-value pairs to update. Valid keys: lodge_name, lodge_number, state, grand_domain, city, meeting_schedule, meeting_location, phone, email, facebook_url, primary_color, accent_color, tagline, founded_year, logo_key",
        ),
    },
    async ({ updates }) => {
      const now = new Date().toISOString();
      const entries = Object.entries(updates);
      for (const [key, value] of entries) {
        await db.run(
          "INSERT INTO lodge_config (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at",
          [key, value, now],
        );
      }
      return {
        content: [
          {
            type: "text",
            text: `Updated ${entries.length} config value(s): ${entries.map(([k]) => k).join(", ")}`,
          },
        ],
      };
    },
  );
}
