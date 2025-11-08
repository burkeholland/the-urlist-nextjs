import Database from 'better-sqlite3';
import path from 'path';
import { LinkBundle } from './types';

const dbPath = path.join(process.cwd(), 'urlist.db');
const db = new Database(dbPath);

// Database row types
interface LinkBundleRow {
  id: string;
  vanityUrl: string;
  description: string;
  userId: string;
  provider: string;
  created_at: string;
  updated_at: string;
}

interface LinkRow {
  id: string;
  bundleId: string;
  url: string;
  title: string;
  description: string;
  image: string;
  position: number;
}

// Initialize database schema
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS link_bundles (
      id TEXT PRIMARY KEY,
      vanityUrl TEXT UNIQUE NOT NULL,
      description TEXT,
      userId TEXT NOT NULL,
      provider TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS links (
      id TEXT PRIMARY KEY,
      bundleId TEXT NOT NULL,
      url TEXT NOT NULL,
      title TEXT,
      description TEXT,
      image TEXT,
      position INTEGER NOT NULL,
      FOREIGN KEY (bundleId) REFERENCES link_bundles(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_bundles_user ON link_bundles(userId, provider);
    CREATE INDEX IF NOT EXISTS idx_bundles_vanity ON link_bundles(vanityUrl);
    CREATE INDEX IF NOT EXISTS idx_links_bundle ON links(bundleId);
  `);
}

// Link Bundle operations
export function createLinkBundle(bundle: LinkBundle): LinkBundle {
  const stmt = db.prepare(`
    INSERT INTO link_bundles (id, vanityUrl, description, userId, provider)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  stmt.run(bundle.id, bundle.vanityUrl, bundle.description, bundle.userId, bundle.provider);

  // Insert links
  if (bundle.links && bundle.links.length > 0) {
    const linkStmt = db.prepare(`
      INSERT INTO links (id, bundleId, url, title, description, image, position)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    bundle.links.forEach((link, index) => {
      linkStmt.run(link.id, bundle.id, link.url, link.title, link.description, link.image, index);
    });
  }

  return bundle;
}

export function getLinkBundle(vanityUrl: string): LinkBundle | null {
  const bundleStmt = db.prepare(`
    SELECT * FROM link_bundles WHERE vanityUrl = ?
  `);
  
  const bundle = bundleStmt.get(vanityUrl) as LinkBundleRow | undefined;
  
  if (!bundle) return null;

  const linksStmt = db.prepare(`
    SELECT * FROM links WHERE bundleId = ? ORDER BY position
  `);
  
  const links = linksStmt.all(bundle.id) as LinkRow[];

  return {
    id: bundle.id,
    vanityUrl: bundle.vanityUrl,
    description: bundle.description,
    userId: bundle.userId,
    provider: bundle.provider,
    links: links.map(link => ({
      id: link.id,
      url: link.url,
      title: link.title,
      description: link.description,
      image: link.image,
    })),
  };
}

export function getLinkBundlesForUser(userId: string, provider: string): LinkBundle[] {
  const bundlesStmt = db.prepare(`
    SELECT * FROM link_bundles WHERE userId = ? AND provider = ? ORDER BY created_at DESC
  `);
  
  const bundles = bundlesStmt.all(userId, provider) as LinkBundleRow[];

  return bundles.map(bundle => {
    const linksStmt = db.prepare(`
      SELECT * FROM links WHERE bundleId = ? ORDER BY position
    `);
    
    const links = linksStmt.all(bundle.id) as LinkRow[];

    return {
      id: bundle.id,
      vanityUrl: bundle.vanityUrl,
      description: bundle.description,
      userId: bundle.userId,
      provider: bundle.provider,
      links: links.map(link => ({
        id: link.id,
        url: link.url,
        title: link.title,
        description: link.description,
        image: link.image,
      })),
    };
  });
}

export function updateLinkBundle(id: string, bundle: Partial<LinkBundle>): boolean {
  const stmt = db.prepare(`
    UPDATE link_bundles 
    SET vanityUrl = COALESCE(?, vanityUrl),
        description = COALESCE(?, description),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `);

  const result = stmt.run(bundle.vanityUrl, bundle.description, id);

  if (bundle.links) {
    // Delete existing links and re-insert
    const deleteStmt = db.prepare('DELETE FROM links WHERE bundleId = ?');
    deleteStmt.run(id);

    const linkStmt = db.prepare(`
      INSERT INTO links (id, bundleId, url, title, description, image, position)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    bundle.links.forEach((link, index) => {
      linkStmt.run(link.id, id, link.url, link.title, link.description, link.image, index);
    });
  }

  return result.changes > 0;
}

export function deleteLinkBundle(id: string): boolean {
  const stmt = db.prepare('DELETE FROM link_bundles WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function vanityUrlExists(vanityUrl: string): boolean {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM link_bundles WHERE vanityUrl = ?');
  const result = stmt.get(vanityUrl) as { count: number } | undefined;
  return (result?.count ?? 0) > 0;
}

// Initialize database on import
initDatabase();

export default db;
