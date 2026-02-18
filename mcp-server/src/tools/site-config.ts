import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { D1Client } from "../db/client.js";

export function registerSiteConfigTools(server: McpServer, db: D1Client) {
  server.tool(
    "site_config_get",
    "Get all grand lodge / site-level configuration values (name, domain, contact info, about text, etc.)",
    {},
    async () => {
      const rows = await db.all<{ key: string; value: string }>(
        "SELECT key, value FROM site_config ORDER BY key",
      );
      const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      return {
        content: [{ type: "text", text: JSON.stringify(config, null, 2) }],
      };
    },
  );

  server.tool(
    "site_config_set",
    "Update one or more grand lodge / site-level configuration values",
    {
      updates: z
        .record(z.string(), z.string())
        .describe(
          "Key-value pairs to update. Valid keys: grand_lodge_name, grand_domain_name, tagline, about_text, history_text, contact_email, contact_phone, website_url, supreme_lodge_url, facebook_url, mailing_address",
        ),
    },
    async ({ updates }) => {
      const now = new Date().toISOString();
      const entries = Object.entries(updates);
      for (const [key, value] of entries) {
        await db.run(
          "INSERT INTO site_config (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at",
          [key, value, now],
        );
      }
      return {
        content: [
          {
            type: "text",
            text: `Updated ${entries.length} site config value(s): ${entries.map(([k]) => k).join(", ")}`,
          },
        ],
      };
    },
  );
}
