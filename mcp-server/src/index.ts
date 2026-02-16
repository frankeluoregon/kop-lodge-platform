#!/usr/bin/env node
/**
 * Knights of Pythias Lodge Platform - MCP Server
 *
 * Exposes tools for managing lodge website content stored in Cloudflare D1.
 * All content tools require a lodge_slug parameter to scope operations.
 *
 * Required environment variables:
 *   CLOUDFLARE_ACCOUNT_ID      - Your Cloudflare account ID
 *   CLOUDFLARE_D1_DATABASE_ID  - D1 database ID
 *   CLOUDFLARE_API_TOKEN       - API token with D1:Edit permission
 */

import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createD1Client, getLodgeId } from "./db/client.js";
import { registerConfigTools } from "./tools/config.js";
import { registerPageTools } from "./tools/pages.js";
import { registerEventTools } from "./tools/events.js";
import { registerBlogTools } from "./tools/blog.js";
import { registerOfficerTools } from "./tools/officers.js";
import { registerCommunityServiceTools } from "./tools/community-service.js";
import { registerGalleryTools } from "./tools/gallery.js";
import { registerLinksTools } from "./tools/links.js";
import { z } from "zod";

async function main() {
  const db = createD1Client();

  const server = new McpServer({
    name: "kop-lodge-platform",
    version: "0.2.0",
  });

  // ——— Lodge management tools ————————————————————————————————————————————————

  server.tool(
    "lodge_list",
    "List all lodges in the platform (active and inactive)",
    { include_inactive: z.boolean().optional().default(false) },
    async ({ include_inactive }) => {
      const where = include_inactive ? "" : "WHERE active = 1";
      const rows = await db.all(
        `SELECT id, slug, name, number, active FROM lodges ${where} ORDER BY CAST(number AS INTEGER) ASC`,
      );
      return {
        content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      };
    },
  );

  server.tool(
    "lodge_create",
    "Add a new lodge to the platform",
    {
      slug: z.string().describe("URL-safe lodge identifier, e.g. 'ivanhoe-1'"),
      name: z.string().describe("Lodge name, e.g. 'Ivanhoe Lodge'"),
      number: z.string().describe("Lodge number, e.g. '1'"),
    },
    async ({ slug, name, number }) => {
      const meta = await db.run(
        "INSERT INTO lodges (slug, name, number) VALUES (?, ?, ?)",
        [slug, name, number],
      );
      return {
        content: [
          {
            type: "text",
            text: `Lodge created (ID: ${meta.last_row_id}): ${name} No. ${number} (slug: '${slug}')`,
          },
        ],
      };
    },
  );

  server.tool(
    "lodge_update",
    "Update lodge details (name, number, or active status)",
    {
      slug: z.string().describe("Lodge slug to update"),
      name: z.string().optional(),
      number: z.string().optional(),
      active: z.boolean().optional(),
    },
    async ({ slug, name, number, active }) => {
      const updates: string[] = [];
      const params: (string | number | null)[] = [];
      if (name !== undefined) { updates.push("name = ?"); params.push(name); }
      if (number !== undefined) { updates.push("number = ?"); params.push(number); }
      if (active !== undefined) { updates.push("active = ?"); params.push(active ? 1 : 0); }
      if (updates.length === 0) {
        return { content: [{ type: "text", text: "No updates provided." }] };
      }
      params.push(slug);
      await db.run(`UPDATE lodges SET ${updates.join(", ")} WHERE slug = ?`, params);
      return {
        content: [{ type: "text", text: `Lodge '${slug}' updated.` }],
      };
    },
  );

  // ——— Content tools (all scoped by lodge_slug) ——————————————————————————————

  registerConfigTools(server, db);
  registerPageTools(server, db);
  registerEventTools(server, db);
  registerBlogTools(server, db);
  registerOfficerTools(server, db);
  registerCommunityServiceTools(server, db);
  registerGalleryTools(server, db);
  registerLinksTools(server, db);

  // ——— Resources: per-lodge URI templates ———————————————————————————————————

  server.resource(
    "lodges",
    "lodge://lodges",
    async (uri) => {
      const rows = await db.all(
        "SELECT id, slug, name, number, active FROM lodges WHERE active = 1 ORDER BY CAST(number AS INTEGER) ASC",
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
    "lodge-config",
    new ResourceTemplate("lodge://{slug}/config", { list: undefined }),
    async (uri, { slug }) => {
      const lodgeSlug = Array.isArray(slug) ? slug[0] : slug;
      const lodgeId = await getLodgeId(db, lodgeSlug);
      const rows = await db.all<{ key: string; value: string }>(
        "SELECT key, value FROM lodge_config WHERE lodge_id = ? ORDER BY key",
        [lodgeId],
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
    "lodge-events",
    new ResourceTemplate("lodge://{slug}/events", { list: undefined }),
    async (uri, { slug }) => {
      const lodgeSlug = Array.isArray(slug) ? slug[0] : slug;
      const lodgeId = await getLodgeId(db, lodgeSlug);
      const rows = await db.all(
        "SELECT * FROM events WHERE lodge_id = ? AND event_date >= date('now') AND published = 1 ORDER BY event_date ASC LIMIT 20",
        [lodgeId],
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
    "lodge-officers",
    new ResourceTemplate("lodge://{slug}/officers", { list: undefined }),
    async (uri, { slug }) => {
      const lodgeSlug = Array.isArray(slug) ? slug[0] : slug;
      const lodgeId = await getLodgeId(db, lodgeSlug);
      const rows = await db.all(
        "SELECT * FROM officers WHERE lodge_id = ? AND active = 1 ORDER BY display_order ASC",
        [lodgeId],
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
    "lodge-blog",
    new ResourceTemplate("lodge://{slug}/blog", { list: undefined }),
    async (uri, { slug }) => {
      const lodgeSlug = Array.isArray(slug) ? slug[0] : slug;
      const lodgeId = await getLodgeId(db, lodgeSlug);
      const rows = await db.all(
        "SELECT id, slug, title, excerpt, author, published_at FROM blog_posts WHERE lodge_id = ? AND published = 1 ORDER BY COALESCE(published_at, created_at) DESC LIMIT 10",
        [lodgeId],
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
