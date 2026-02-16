/**
 * Typed helpers for querying D1 from Astro SSR pages.
 * All content is scoped by lodge_id.
 */

export interface Lodge {
  id: number;
  slug: string;
  name: string;
  number: string;
  active: number;
}

export interface LodgeConfig {
  lodge_name: string;
  lodge_number: string;
  state: string;
  grand_domain: string;
  city: string;
  meeting_schedule: string;
  meeting_location: string;
  phone: string;
  email: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  donation_url: string;
  grand_lodge_url: string;
  mailing_address: string;
  primary_color: string;
  accent_color: string;
  tagline: string;
  founded_year: string;
  logo_key: string;
  // Section toggles ("1" = show, "" = hide)
  show_history: string;
  show_membership: string;
  show_gallery: string;
  show_links: string;
  show_newsletter: string;
  show_programs: string;
  show_blog: string;
  show_events: string;
  show_officers: string;
  show_service: string;
}

export interface GalleryPhoto {
  id: number;
  lodge_id: number;
  image_key: string;
  caption: string | null;
  display_order: number;
  published: number;
}

export interface Link {
  id: number;
  lodge_id: number;
  title: string;
  url: string;
  category: string;
  description: string | null;
  display_order: number;
}

export interface Event {
  id: number;
  lodge_id: number;
  title: string;
  description: string | null;
  event_date: string;
  end_date: string | null;
  location: string | null;
  level: "lodge" | "grand" | "supreme";
  url: string | null;
  image_key: string | null;
  published: number;
}

export interface BlogPost {
  id: number;
  lodge_id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string | null;
  image_key: string | null;
  published: number;
  published_at: string | null;
}

export interface Officer {
  id: number;
  lodge_id: number;
  title: string;
  name: string;
  email: string | null;
  photo_key: string | null;
  display_order: number;
}

export interface CommunityService {
  id: number;
  lodge_id: number;
  title: string;
  description: string;
  service_date: string | null;
  image_key: string | null;
  featured: number;
}

export interface Page {
  id: number;
  lodge_id: number;
  slug: string;
  title: string;
  content: string;
  meta_description: string | null;
}

// ─── Lodge helpers ──────────────────────────────────────────────────────────

export async function getAllLodges(db: D1Database): Promise<Lodge[]> {
  const res = await db
    .prepare("SELECT * FROM lodges WHERE active = 1 ORDER BY CAST(number AS INTEGER) ASC")
    .all<Lodge>();
  return res.results;
}

export async function getAllLodgesAdmin(db: D1Database): Promise<Lodge[]> {
  const res = await db
    .prepare("SELECT * FROM lodges ORDER BY CAST(number AS INTEGER) ASC")
    .all<Lodge>();
  return res.results;
}

export async function getLodgeById(db: D1Database, id: number): Promise<Lodge | null> {
  return db.prepare("SELECT * FROM lodges WHERE id = ?").bind(id).first<Lodge>();
}

export async function getLodgeBySlug(
  db: D1Database,
  slug: string,
): Promise<Lodge | null> {
  return db
    .prepare("SELECT * FROM lodges WHERE slug = ? AND active = 1")
    .bind(slug)
    .first<Lodge>();
}

export async function createLodge(
  db: D1Database,
  slug: string,
  name: string,
  number: string,
): Promise<number> {
  const res = await db
    .prepare("INSERT INTO lodges (slug, name, number, active) VALUES (?, ?, ?, 1)")
    .bind(slug, name, number)
    .run();
  const id = res.meta.last_row_id as number;
  await db
    .prepare("INSERT INTO lodge_config (lodge_id, key, value) VALUES (?, 'lodge_name', ?), (?, 'lodge_number', ?)")
    .bind(id, name, id, number)
    .run();
  return id;
}

export async function updateLodge(
  db: D1Database,
  id: number,
  slug: string,
  name: string,
  number: string,
  active: number,
): Promise<void> {
  await db
    .prepare("UPDATE lodges SET slug = ?, name = ?, number = ?, active = ? WHERE id = ?")
    .bind(slug, name, number, active, id)
    .run();
}

// ─── Config ─────────────────────────────────────────────────────────────────

export async function getConfig(
  db: D1Database,
  lodgeId: number,
): Promise<LodgeConfig> {
  const rows = await db
    .prepare("SELECT key, value FROM lodge_config WHERE lodge_id = ?")
    .bind(lodgeId)
    .all<{ key: string; value: string }>();
  const map: Record<string, string> = {};
  for (const row of rows.results) map[row.key] = row.value;
  // Defaults
  if (!map.lodge_name) map.lodge_name = "Lodge";
  if (!map.primary_color) map.primary_color = "#252e67";
  if (!map.accent_color) map.accent_color = "#f5a71c";
  return map as unknown as LodgeConfig;
}

// ─── Pages ──────────────────────────────────────────────────────────────────

export async function getPage(
  db: D1Database,
  lodgeId: number,
  slug: string,
): Promise<Page | null> {
  return db
    .prepare("SELECT * FROM pages WHERE lodge_id = ? AND slug = ?")
    .bind(lodgeId, slug)
    .first<Page>();
}

export async function getAllPages(
  db: D1Database,
  lodgeId: number,
): Promise<Page[]> {
  const res = await db
    .prepare("SELECT * FROM pages WHERE lodge_id = ? ORDER BY slug")
    .bind(lodgeId)
    .all<Page>();
  return res.results;
}

// ─── Events ─────────────────────────────────────────────────────────────────

export async function getUpcomingEvents(
  db: D1Database,
  lodgeId: number,
  level?: "lodge" | "grand" | "supreme",
  limit = 10,
): Promise<Event[]> {
  const levelClause = level ? "AND level = ?" : "";
  const params = level
    ? [lodgeId, new Date().toISOString().slice(0, 10), level, limit]
    : [lodgeId, new Date().toISOString().slice(0, 10), limit];
  const res = await db
    .prepare(
      `SELECT * FROM events
       WHERE lodge_id = ? AND event_date >= ? AND published = 1 ${levelClause}
       ORDER BY event_date ASC LIMIT ?`,
    )
    .bind(...params)
    .all<Event>();
  return res.results;
}

export async function getAllEvents(
  db: D1Database,
  lodgeId: number,
): Promise<Event[]> {
  const res = await db
    .prepare(
      "SELECT * FROM events WHERE lodge_id = ? AND published = 1 ORDER BY event_date ASC",
    )
    .bind(lodgeId)
    .all<Event>();
  return res.results;
}

// ─── Blog ────────────────────────────────────────────────────────────────────

export async function getPublishedPosts(
  db: D1Database,
  lodgeId: number,
  limit = 10,
): Promise<BlogPost[]> {
  const res = await db
    .prepare(
      "SELECT * FROM blog_posts WHERE lodge_id = ? AND published = 1 ORDER BY COALESCE(published_at, created_at) DESC LIMIT ?",
    )
    .bind(lodgeId, limit)
    .all<BlogPost>();
  return res.results;
}

export async function getBlogPost(
  db: D1Database,
  lodgeId: number,
  slug: string,
): Promise<BlogPost | null> {
  return db
    .prepare(
      "SELECT * FROM blog_posts WHERE lodge_id = ? AND slug = ? AND published = 1",
    )
    .bind(lodgeId, slug)
    .first<BlogPost>();
}

export async function getAllPosts(
  db: D1Database,
  lodgeId: number,
  limit = 20,
): Promise<BlogPost[]> {
  const res = await db
    .prepare(
      "SELECT * FROM blog_posts WHERE lodge_id = ? ORDER BY COALESCE(published_at, created_at) DESC LIMIT ?",
    )
    .bind(lodgeId, limit)
    .all<BlogPost>();
  return res.results;
}

// ─── Officers ────────────────────────────────────────────────────────────────

export async function getOfficers(
  db: D1Database,
  lodgeId: number,
): Promise<Officer[]> {
  const res = await db
    .prepare(
      "SELECT * FROM officers WHERE lodge_id = ? AND active = 1 ORDER BY display_order ASC",
    )
    .bind(lodgeId)
    .all<Officer>();
  return res.results;
}

export async function getAllOfficers(
  db: D1Database,
  lodgeId: number,
): Promise<Officer[]> {
  const res = await db
    .prepare(
      "SELECT * FROM officers WHERE lodge_id = ? ORDER BY display_order ASC, id ASC",
    )
    .bind(lodgeId)
    .all<Officer>();
  return res.results;
}

// ─── Community Service ───────────────────────────────────────────────────────

export async function getCommunityService(
  db: D1Database,
  lodgeId: number,
  featuredOnly = false,
  limit = 12,
): Promise<CommunityService[]> {
  const clause = featuredOnly ? "AND featured = 1" : "";
  const res = await db
    .prepare(
      `SELECT * FROM community_service
       WHERE lodge_id = ? AND published = 1 ${clause}
       ORDER BY COALESCE(service_date, created_at) DESC LIMIT ?`,
    )
    .bind(lodgeId, limit)
    .all<CommunityService>();
  return res.results;
}

// ─── Gallery ────────────────────────────────────────────────────────────────

export async function getGalleryPhotos(
  db: D1Database,
  lodgeId: number,
): Promise<GalleryPhoto[]> {
  const res = await db
    .prepare(
      "SELECT * FROM gallery_photos WHERE lodge_id = ? AND published = 1 ORDER BY display_order ASC, id DESC",
    )
    .bind(lodgeId)
    .all<GalleryPhoto>();
  return res.results;
}

export async function getAllGalleryPhotos(
  db: D1Database,
  lodgeId: number,
): Promise<GalleryPhoto[]> {
  const res = await db
    .prepare(
      "SELECT * FROM gallery_photos WHERE lodge_id = ? ORDER BY display_order ASC, id DESC",
    )
    .bind(lodgeId)
    .all<GalleryPhoto>();
  return res.results;
}

// ─── Links ──────────────────────────────────────────────────────────────────

export async function getLinks(
  db: D1Database,
  lodgeId: number,
): Promise<Link[]> {
  const res = await db
    .prepare(
      "SELECT * FROM links WHERE lodge_id = ? ORDER BY category ASC, display_order ASC, title ASC",
    )
    .bind(lodgeId)
    .all<Link>();
  return res.results;
}

export async function getAllLinks(
  db: D1Database,
  lodgeId: number,
): Promise<Link[]> {
  const res = await db
    .prepare(
      "SELECT * FROM links WHERE lodge_id = ? ORDER BY category ASC, display_order ASC, title ASC",
    )
    .bind(lodgeId)
    .all<Link>();
  return res.results;
}
