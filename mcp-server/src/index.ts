#!/usr/bin/env node
/**
 * Knights of Pythias Lodge Platform - MCP Server
 *
 * Exposes tools for managing lodge website content stored in Cloudflare D1.
 *
 * Required environment variables:
 *   CLOUDFLARE_ACCOUNT_ID   - Your Cloudflare account ID
 *   CLOUDFLARE_D1_DATABASE_ID - D1 database ID
 *   CLOUDFLARE_API_TOKEN    - API token with D1:Edit permission
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createD1Client } from "./db/client.js";
import { registerConfigTools } from "./tools/config.js";
import { registerPageTools } from "./tools/pages.js";
import { registerEventTools } from "./tools/events.js";
import { registerBlogTools } from "./tools/blog.js";
import { registerOfficerTools } from "./tools/officers.js";
import { registerCommunityServiceTools } from "./tools/community-service.js";

async function main() {
  const db = createD1Client();

  const server = new McpServer({
    name: "kop-lodge-platform",
    version: "0.1.0",
  });

  // Register all tool groups
  registerConfigTools(server, db);
  registerPageTools(server, db);
  registerEventTools(server, db);
  registerBlogTools(server, db);
  registerOfficerTools(server, db);
  registerCommunityServiceTools(server, db);

  // Resources: expose readable snapshots of content
  server.resource(
    "lodge-config",
    "lodge://config",
    async (uri) => {
      const rows = await db.all<{ key: string; value: string }>(
        "SELECT key, value FROM lodge_config ORDER BY key",
      );
      const config = Object.fromEntries(rows.map((r) => [r.key, r.value]));
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(config, null, 2),
          },
        ],
      };
    },
  );

  server.resource(
    "upcoming-events",
    "lodge://events/upcoming",
    async (uri) => {
      const rows = await db.all(
        "SELECT * FROM events WHERE event_date >= date('now') AND published = 1 ORDER BY event_date ASC LIMIT 20",
      );
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    },
  );

  server.resource(
    "officers",
    "lodge://officers",
    async (uri) => {
      const rows = await db.all(
        "SELECT * FROM officers WHERE active = 1 ORDER BY display_order ASC",
      );
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    },
  );

  server.resource(
    "recent-blog-posts",
    "lodge://blog/recent",
    async (uri) => {
      const rows = await db.all(
        "SELECT id, slug, title, excerpt, author, published_at FROM blog_posts WHERE published = 1 ORDER BY published_at DESC LIMIT 10",
      );
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    },
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("KoP Lodge MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
