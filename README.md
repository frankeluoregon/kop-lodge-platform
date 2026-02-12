# Knights of Pythias Lodge Platform

A full-stack platform for creating and managing public websites for Knights of Pythias lodges.
Consists of two parts:

1. **MCP Server** (`mcp-server/`) — Lets Claude manage content via natural-language requests
2. **Astro Website** (`website/`) — Public lodge site + web admin panel, hosted on Cloudflare Pages

---

## Architecture

```
Cloudflare D1 (database)   ←→   MCP Server (local, stdio)
        ↕
Cloudflare Pages (Astro SSR)
    Public site  +  Admin panel (/admin)
```

**Cloudflare resources created:**
- D1 Database: `kop-lodge-platform` (ID: `7be87ef0-979a-4363-8bed-f04a4a6dd991`)
- R2 Bucket: `kop-lodge-media` *(create manually — see below)*

---

## Setup

### Prerequisites

- Node.js 20+
- `npm install -g wrangler` (Cloudflare CLI)
- Cloudflare account (free tier works)

### 1. Configure your lodge

Run `wrangler d1 execute kop-lodge-platform --command` or use the Admin panel after deployment to set:

- Lodge name, number, city, state
- Meeting schedule and location
- Contact info and colors

### 2. Create the R2 media bucket

```bash
wrangler r2 bucket create kop-lodge-media
```

### 3. Set your admin token

Choose a strong secret token and compute its SHA-256 hash:

**Linux/Mac:**
```bash
echo -n "your-secret-token" | sha256sum
```

**Windows PowerShell:**
```powershell
$t = [System.Text.Encoding]::UTF8.GetBytes("your-secret-token")
[System.BitConverter]::ToString([System.Security.Cryptography.SHA256]::Create().ComputeHash($t)).Replace("-","").ToLower()
```

Add the hash to `website/wrangler.toml`:
```toml
[vars]
ADMIN_TOKEN_HASH = "paste-hash-here"
```

### 4. Deploy the website

```bash
cd website
npm install
npm run build
wrangler pages deploy dist --project-name kop-lodge-website
```

Or connect the repo to Cloudflare Pages for automatic deploys on push.

### 5. Install and register the MCP Server

```bash
cd mcp-server
npm install
npm run build
```

Add to your Claude Code `~/.claude/claude.json` MCP config:

```json
{
  "mcpServers": {
    "kop-lodge": {
      "command": "node",
      "args": ["C:\\Users\\frankel\\kop-lodge-platform\\mcp-server\\dist\\index.js"],
      "env": {
        "CLOUDFLARE_ACCOUNT_ID": "64ac8bcfa36a217ddf835b7778b47568",
        "CLOUDFLARE_D1_DATABASE_ID": "7be87ef0-979a-4363-8bed-f04a4a6dd991",
        "CLOUDFLARE_API_TOKEN": "your_api_token_here"
      }
    }
  }
}
```

**Create a Cloudflare API token** at https://dash.cloudflare.com/profile/api-tokens with:
- Permission: `D1 - Edit`

---

## Using the MCP Server

Once registered, tell Claude things like:

> "Set the lodge name to Eugene Lodge No. 7 in Eugene, Oregon."
> "Add an event: Fish Fry Dinner on April 5, 2025 at the lodge hall."
> "Create a blog post about our food drive. Publish it immediately."
> "Update the officers — Chancellor Commander is John Smith, Vice Chancellor is Jane Doe..."

Available tools:
| Tool | Purpose |
|------|---------|
| `config_get` / `config_set` | Lodge name, colors, contact info |
| `page_list` / `page_get` / `page_upsert` | About Us and other pages |
| `event_list` / `event_create` / `event_update` / `event_delete` | Calendar |
| `blog_list` / `blog_get` / `blog_create` / `blog_update` / `blog_delete` | Blog posts |
| `officers_list` / `officer_create` / `officer_update` / `officers_replace` | Officer roster |
| `community_service_list` / `community_service_create` / `community_service_update` / `community_service_delete` | Service showcase |

Available resources:
- `lodge://config` — current lodge configuration
- `lodge://events/upcoming` — upcoming events
- `lodge://officers` — active officers
- `lodge://blog/recent` — recent published posts

---

## Admin Web Panel

After deploying, visit `/admin` on your site:

1. Log in with your admin token
2. Dashboard shows overview of all content
3. Edit events, blog posts, officers, pages, community service
4. All changes are live immediately (no build/redeploy needed — it's SSR)

---

## Website Pages

| URL | Description |
|-----|-------------|
| `/` | Home — upcoming events, featured service, latest blog |
| `/about` | About Us page (editable) |
| `/events` | Full events calendar (lodge, grand, supreme) |
| `/officers` | Current officer roster |
| `/community-service` | Service showcase |
| `/blog` | Blog index |
| `/blog/[slug]` | Individual blog post |
| `/contact` | Contact info |
| `/admin` | Admin dashboard (password protected) |

---

## Extending to Other Lodges

Each lodge gets its own:
1. Cloudflare Pages project (fork this repo)
2. D1 database (run schema.sql against it)
3. Separate `wrangler.toml` with its own `ADMIN_TOKEN_HASH`

The schema and all templates are generic — just update `lodge_config` for each lodge.
See `mcp-server/src/db/schema.sql` for the full database schema.

---

## KoP Branding Defaults

- Primary color: `#4B0082` (purple)
- Accent color: `#FFD700` (gold)
- Tagline: "Friendship, Charity, Benevolence"

These are configurable per-lodge via `lodge_config`.
