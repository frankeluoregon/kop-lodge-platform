-- Migration: single-lodge → multi-lodge
-- Run against the existing D1 database before deploying the refactored site.

-- 1. Create lodges table
CREATE TABLE IF NOT EXISTS lodges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  number TEXT NOT NULL,
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- 2. Seed the 11 Oregon lodges
INSERT OR IGNORE INTO lodges (slug, name, number) VALUES
  ('ivanhoe-1',  'Ivanhoe Lodge No. 1',   '1'),
  ('damon-4',    'Damon Lodge No. 4',     '4'),
  ('glencoe-22', 'Glencoe Lodge No. 22',  '22'),
  ('talisman-31','Talisman Lodge No. 31', '31'),
  ('helmet-33',  'Helmet Lodge No. 33',   '33'),
  ('phoenix-34', 'Phoenix Lodge No. 34',  '34'),
  ('delphos-39', 'Delphos Lodge No. 39',  '39'),
  ('alpha-47',   'Alpha Lodge No. 47',    '47'),
  ('hermes-56',  'Hermes Lodge No. 56',   '56'),
  ('diana-63',   'Diana Lodge No. 63',    '63'),
  ('gaston-104', 'Gaston Lodge No. 104',  '104');

-- 3. Rename old single-tenant tables to _old
ALTER TABLE lodge_config      RENAME TO _old_lodge_config;
ALTER TABLE pages              RENAME TO _old_pages;
ALTER TABLE events             RENAME TO _old_events;
ALTER TABLE blog_posts         RENAME TO _old_blog_posts;
ALTER TABLE officers           RENAME TO _old_officers;
ALTER TABLE community_service  RENAME TO _old_community_service;
ALTER TABLE media              RENAME TO _old_media;

-- 4. Create new multi-tenant tables
CREATE TABLE lodge_config (
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (lodge_id, key)
);
CREATE TABLE pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_description TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (lodge_id, slug)
);
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,
  end_date TEXT,
  location TEXT,
  level TEXT NOT NULL CHECK(level IN ('lodge','grand','supreme')),
  url TEXT,
  image_key TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT,
  image_key TEXT,
  published INTEGER DEFAULT 0,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (lodge_id, slug)
);
CREATE TABLE officers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  photo_key TEXT,
  display_order INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE community_service (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_date TEXT,
  image_key TEXT,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE media (
  key TEXT PRIMARY KEY,
  lodge_id INTEGER REFERENCES lodges(id),
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  alt_text TEXT,
  uploaded_at TEXT DEFAULT (datetime('now'))
);

-- 5. Migrate existing single-lodge data to lodge_id = 1 (ivanhoe-1 or whatever was set up)
--    Change lodge_id = 1 to the actual lodge ID if different.
INSERT INTO lodge_config (lodge_id, key, value, updated_at)
  SELECT 1, key, value, updated_at FROM _old_lodge_config;

INSERT INTO pages (lodge_id, slug, title, content, meta_description, updated_at)
  SELECT 1, slug, title, content, meta_description, updated_at FROM _old_pages;

INSERT INTO events (lodge_id, title, description, event_date, end_date, location, level, url, image_key, published, created_at, updated_at)
  SELECT 1, title, description, event_date, end_date, location, level, url, image_key, published, created_at, updated_at FROM _old_events;

INSERT INTO blog_posts (lodge_id, slug, title, excerpt, content, author, image_key, published, published_at, created_at, updated_at)
  SELECT 1, slug, title, excerpt, content, author, image_key, published, published_at, created_at, updated_at FROM _old_blog_posts;

INSERT INTO officers (lodge_id, title, name, email, photo_key, display_order, active, updated_at)
  SELECT 1, title, name, email, photo_key, display_order, active, updated_at FROM _old_officers;

INSERT INTO community_service (lodge_id, title, description, service_date, image_key, featured, published, created_at, updated_at)
  SELECT 1, title, description, service_date, image_key, featured, published, created_at, updated_at FROM _old_community_service;

INSERT INTO media (key, lodge_id, filename, mime_type, size_bytes, alt_text, uploaded_at)
  SELECT key, 1, filename, mime_type, size_bytes, alt_text, uploaded_at FROM _old_media;

-- 6. Create indexes
CREATE INDEX IF NOT EXISTS idx_events_lodge   ON events(lodge_id, event_date);
CREATE INDEX IF NOT EXISTS idx_blog_lodge     ON blog_posts(lodge_id, published);
CREATE INDEX IF NOT EXISTS idx_officers_lodge ON officers(lodge_id, active);
CREATE INDEX IF NOT EXISTS idx_service_lodge  ON community_service(lodge_id, featured);

-- 7. Drop old tables (run these only after verifying data migration)
-- DROP TABLE _old_lodge_config;
-- DROP TABLE _old_pages;
-- DROP TABLE _old_events;
-- DROP TABLE _old_blog_posts;
-- DROP TABLE _old_officers;
-- DROP TABLE _old_community_service;
-- DROP TABLE _old_media;
-- DROP TABLE IF EXISTS admin_tokens;
