globalThis.process ??= {}; globalThis.process.env ??= {};
async function getConfig(db) {
  const rows = await db.prepare("SELECT key, value FROM lodge_config").all();
  const map = {};
  for (const row of rows.results) map[row.key] = row.value;
  return map;
}
async function getPage(db, slug) {
  return db.prepare("SELECT * FROM pages WHERE slug = ?").bind(slug).first();
}
async function getUpcomingEvents(db, level, limit = 10) {
  const levelClause = "";
  const params = [(/* @__PURE__ */ new Date()).toISOString().slice(0, 10), limit];
  const res = await db.prepare(
    `SELECT * FROM events
       WHERE event_date >= ? AND published = 1 ${levelClause}
       ORDER BY event_date ASC LIMIT ?`
  ).bind(...params).all();
  return res.results;
}
async function getAllEvents(db) {
  const res = await db.prepare(
    "SELECT * FROM events WHERE published = 1 ORDER BY event_date ASC"
  ).all();
  return res.results;
}
async function getPublishedPosts(db, limit = 10) {
  const res = await db.prepare(
    "SELECT * FROM blog_posts WHERE published = 1 ORDER BY COALESCE(published_at, created_at) DESC LIMIT ?"
  ).bind(limit).all();
  return res.results;
}
async function getBlogPost(db, slug) {
  return db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND published = 1").bind(slug).first();
}
async function getOfficers(db) {
  const res = await db.prepare(
    "SELECT * FROM officers WHERE active = 1 ORDER BY display_order ASC"
  ).all();
  return res.results;
}
async function getCommunityService(db, featuredOnly = false, limit = 12) {
  const clause = featuredOnly ? "AND featured = 1" : "";
  const res = await db.prepare(
    `SELECT * FROM community_service
       WHERE published = 1 ${clause}
       ORDER BY COALESCE(service_date, created_at) DESC LIMIT ?`
  ).bind(limit).all();
  return res.results;
}

export { getPage as a, getUpcomingEvents as b, getPublishedPosts as c, getOfficers as d, getCommunityService as e, getBlogPost as f, getConfig as g, getAllEvents as h };
