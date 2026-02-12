-- Knights of Pythias Lodge Platform - D1 Schema
-- Database ID: 7be87ef0-979a-4363-8bed-f04a4a6dd991

CREATE TABLE IF NOT EXISTS lodge_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,        -- Markdown
  meta_description TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,     -- ISO 8601
  end_date TEXT,
  location TEXT,
  level TEXT NOT NULL CHECK(level IN ('lodge','grand','supreme')),
  url TEXT,
  image_key TEXT,               -- R2 object key
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,        -- Markdown
  author TEXT,
  image_key TEXT,
  published INTEGER DEFAULT 0,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS officers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  photo_key TEXT,
  display_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS community_service (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,   -- Markdown
  service_date TEXT,
  image_key TEXT,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  key TEXT PRIMARY KEY,         -- R2 object key
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  alt_text TEXT,
  uploaded_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_tokens (
  token_hash TEXT PRIMARY KEY,
  label TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  last_used TEXT
);
