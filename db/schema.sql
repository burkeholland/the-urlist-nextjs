-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  name TEXT,
  image TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link bundles table
CREATE TABLE IF NOT EXISTS link_bundles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  vanity_url TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Links table
CREATE TABLE IF NOT EXISTS links (
  id TEXT PRIMARY KEY,
  bundle_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  image TEXT,
  sort_order INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(bundle_id) REFERENCES link_bundles(id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_link_bundles_user_id ON link_bundles(user_id);
CREATE INDEX IF NOT EXISTS idx_link_bundles_vanity_url ON link_bundles(vanity_url);
CREATE INDEX IF NOT EXISTS idx_links_bundle_id ON links(bundle_id);
