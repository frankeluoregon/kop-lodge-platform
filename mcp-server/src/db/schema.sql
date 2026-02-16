-- Knights of Pythias Lodge Platform - D1 Schema (multi-lodge)
-- Database ID: 7be87ef0-979a-4363-8bed-f04a4a6dd991

CREATE TABLE IF NOT EXISTS lodges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,      -- URL slug, e.g. 'ivanhoe-1'
  name TEXT NOT NULL,             -- e.g. 'Ivanhoe Lodge No. 1'
  number TEXT NOT NULL,           -- e.g. '1'
  active INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- lodge_config scoped per lodge
CREATE TABLE IF NOT EXISTS lodge_config (
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (lodge_id, key)
);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,          -- Markdown
  meta_description TEXT,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (lodge_id, slug)
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  title TEXT NOT NULL,
  description TEXT,
  event_date TEXT NOT NULL,       -- ISO 8601
  end_date TEXT,
  location TEXT,
  level TEXT NOT NULL CHECK(level IN ('lodge','grand','supreme')),
  url TEXT,
  image_key TEXT,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,          -- Markdown
  author TEXT,
  image_key TEXT,
  published INTEGER DEFAULT 0,
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE (lodge_id, slug)
);

CREATE TABLE IF NOT EXISTS officers (
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

CREATE TABLE IF NOT EXISTS community_service (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,      -- Markdown
  service_date TEXT,
  image_key TEXT,
  featured INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS media (
  key TEXT PRIMARY KEY,           -- R2 object key
  lodge_id INTEGER REFERENCES lodges(id),
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  alt_text TEXT,
  uploaded_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS gallery_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  image_key TEXT NOT NULL,         -- R2 object key
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'general', 'pythian', 'community', etc.
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS admin_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  role TEXT NOT NULL,             -- 'site-admin' or 'lodge:{slug}'
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(email, role)
);

CREATE TABLE IF NOT EXISTS lodge_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  degree INTEGER DEFAULT 1,       -- 1=First, 2=Second, 3=Third (Knight)
  joined_date TEXT,               -- ISO date
  active INTEGER DEFAULT 1,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS meeting_minutes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  meeting_date TEXT NOT NULL,     -- ISO date
  title TEXT,
  content TEXT NOT NULL,          -- markdown
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS lodge_announcements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lodge_id INTEGER NOT NULL REFERENCES lodges(id),
  title TEXT NOT NULL,
  content TEXT NOT NULL,          -- markdown
  expires_at TEXT,                -- optional ISO date
  published INTEGER DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_lodge       ON events(lodge_id, event_date);
CREATE INDEX IF NOT EXISTS idx_blog_lodge         ON blog_posts(lodge_id, published);
CREATE INDEX IF NOT EXISTS idx_officers_lodge     ON officers(lodge_id, active);
CREATE INDEX IF NOT EXISTS idx_service_lodge      ON community_service(lodge_id, featured);
CREATE INDEX IF NOT EXISTS idx_admin_roles_email  ON admin_roles(email);
CREATE INDEX IF NOT EXISTS idx_gallery_lodge      ON gallery_photos(lodge_id, display_order);
CREATE INDEX IF NOT EXISTS idx_links_lodge        ON links(lodge_id, category);
CREATE INDEX IF NOT EXISTS idx_members_lodge      ON lodge_members(lodge_id, active);
CREATE INDEX IF NOT EXISTS idx_minutes_lodge      ON meeting_minutes(lodge_id, meeting_date);
CREATE INDEX IF NOT EXISTS idx_announcements_lodge ON lodge_announcements(lodge_id, published);
