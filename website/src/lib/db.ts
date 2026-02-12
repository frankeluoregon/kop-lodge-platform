/**
 * Typed helpers for querying D1 from Astro SSR pages.
 */

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
  primary_color: string;
  accent_color: string;
  tagline: string;
  founded_year: string;
  logo_key: string;
}

export interface Event {
  id: number;
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
  title: string;
  name: string;
  email: string | null;
  photo_key: string | null;
  display_order: number;
}

export interface CommunityService {
  id: number;
  title: string;
  description: string;
  service_date: string | null;
  image_key: string | null;
  featured: number;
}

export interface Page {
  slug: string;
  title: string;
  content: string;
  meta_description: string | null;
}

export async function getConfig(db: D1Database): Promise<LodgeConfig> {
  const rows = await db
    .prepare("SELECT key, value FROM lodge_config")
    .all<{ key: string; value: string }>();
  const map: Record<string, string> = {};
  for (const row of rows.results) map[row.key] = row.value;
  return map as unknown as LodgeConfig;
}

export async function getPage(db: D1Database, slug: string): Promise<Page | null> {
  return db
    .prepare("SELECT * FROM pages WHERE slug = ?")
    .bind(slug)
    .first<Page>();
}

export async function getUpcomingEvents(
  db: D1Database,
  level?: "lodge" | "grand" | "supreme",
  limit = 10,
): Promise<Event[]> {
  const levelClause = level ? "AND level = ?" : "";
  const params = level
    ? [new Date().toISOString().slice(0, 10), level, limit]
    : [new Date().toISOString().slice(0, 10), limit];
  const res = await db
    .prepare(
      `SELECT * FROM events
       WHERE event_date >= ? AND published = 1 ${levelClause}
       ORDER BY event_date ASC LIMIT ?`,
    )
    .bind(...params)
    .all<Event>();
  return res.results;
}

export async function getAllEvents(db: D1Database): Promise<Event[]> {
  const res = await db
    .prepare(
      "SELECT * FROM events WHERE published = 1 ORDER BY event_date ASC",
    )
    .all<Event>();
  return res.results;
}

export async function getPublishedPosts(db: D1Database, limit = 10): Promise<BlogPost[]> {
  const res = await db
    .prepare(
      "SELECT * FROM blog_posts WHERE published = 1 ORDER BY COALESCE(published_at, created_at) DESC LIMIT ?",
    )
    .bind(limit)
    .all<BlogPost>();
  return res.results;
}

export async function getBlogPost(db: D1Database, slug: string): Promise<BlogPost | null> {
  return db
    .prepare("SELECT * FROM blog_posts WHERE slug = ? AND published = 1")
    .bind(slug)
    .first<BlogPost>();
}

export async function getOfficers(db: D1Database): Promise<Officer[]> {
  const res = await db
    .prepare(
      "SELECT * FROM officers WHERE active = 1 ORDER BY display_order ASC",
    )
    .all<Officer>();
  return res.results;
}

export async function getCommunityService(
  db: D1Database,
  featuredOnly = false,
  limit = 12,
): Promise<CommunityService[]> {
  const clause = featuredOnly ? "AND featured = 1" : "";
  const res = await db
    .prepare(
      `SELECT * FROM community_service
       WHERE published = 1 ${clause}
       ORDER BY COALESCE(service_date, created_at) DESC LIMIT ?`,
    )
    .bind(limit)
    .all<CommunityService>();
  return res.results;
}
