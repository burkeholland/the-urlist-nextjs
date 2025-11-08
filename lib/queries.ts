import { getDb } from './db';
import { v4 as uuidv4 } from 'uuid';
import type {
  User,
  Link,
  LinkBundle,
  LinkBundleWithLinks,
  CreateLinkBundleInput,
  UpdateLinkBundleInput,
} from './types';

// User operations
export function createUser(user: Omit<User, 'created_at'>): User {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO users (id, provider, name, image, email) VALUES (?, ?, ?, ?, ?)'
  );
  
  stmt.run(user.id, user.provider, user.name, user.image, user.email);
  
  return getUserById(user.id)!;
}

export function getUserById(id: string): User | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id) as User | null;
}

export function getUserByEmail(email: string): User | null {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email) as User | null;
}

export function upsertUser(user: Omit<User, 'created_at'>): User {
  const existing = getUserById(user.id);
  if (existing) {
    const db = getDb();
    const stmt = db.prepare(
      'UPDATE users SET name = ?, image = ?, email = ? WHERE id = ?'
    );
    stmt.run(user.name, user.image, user.email, user.id);
    return getUserById(user.id)!;
  }
  return createUser(user);
}

// LinkBundle operations
export function createLinkBundle(
  userId: string,
  input: CreateLinkBundleInput
): LinkBundleWithLinks {
  const db = getDb();
  const bundleId = uuidv4();
  
  // Start transaction
  const insertBundle = db.transaction(() => {
    // Insert bundle
    const stmt = db.prepare(
      'INSERT INTO link_bundles (id, user_id, vanity_url, title, description) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(bundleId, userId, input.vanity_url, input.title || null, input.description || null);
    
    // Insert links
    if (input.links && input.links.length > 0) {
      const linkStmt = db.prepare(
        'INSERT INTO links (id, bundle_id, url, title, description, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      
      for (const link of input.links) {
        linkStmt.run(
          uuidv4(),
          bundleId,
          link.url,
          link.title || null,
          link.description || null,
          link.image || null,
          link.sort_order
        );
      }
    }
  });
  
  insertBundle();
  
  return getLinkBundleById(bundleId)!;
}

export function getLinkBundleById(id: string): LinkBundleWithLinks | null {
  const db = getDb();
  const bundleStmt = db.prepare('SELECT * FROM link_bundles WHERE id = ?');
  const bundle = bundleStmt.get(id) as LinkBundle | null;
  
  if (!bundle) return null;
  
  const linksStmt = db.prepare('SELECT * FROM links WHERE bundle_id = ? ORDER BY sort_order ASC');
  const links = linksStmt.all(bundle.id) as Link[];
  
  return { ...bundle, links };
}

export function getLinkBundleByVanityUrl(vanityUrl: string): LinkBundleWithLinks | null {
  const db = getDb();
  const bundleStmt = db.prepare('SELECT * FROM link_bundles WHERE vanity_url = ?');
  const bundle = bundleStmt.get(vanityUrl) as LinkBundle | null;
  
  if (!bundle) return null;
  
  const linksStmt = db.prepare('SELECT * FROM links WHERE bundle_id = ? ORDER BY sort_order ASC');
  const links = linksStmt.all(bundle.id) as Link[];
  
  return { ...bundle, links };
}

export function getLinkBundlesByUserId(userId: string): LinkBundleWithLinks[] {
  const db = getDb();
  const bundleStmt = db.prepare('SELECT * FROM link_bundles WHERE user_id = ? ORDER BY created_at DESC');
  const bundles = bundleStmt.all(userId) as LinkBundle[];
  
  return bundles.map(bundle => {
    const linksStmt = db.prepare('SELECT * FROM links WHERE bundle_id = ? ORDER BY sort_order ASC');
    const links = linksStmt.all(bundle.id) as Link[];
    return { ...bundle, links };
  });
}

export function updateLinkBundle(
  id: string,
  input: UpdateLinkBundleInput
): LinkBundleWithLinks | null {
  const db = getDb();
  
  const updateTransaction = db.transaction(() => {
    // Update bundle metadata
    const updateStmt = db.prepare(
      'UPDATE link_bundles SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    );
    updateStmt.run(input.title || null, input.description || null, id);
    
    // If links are provided, replace all links
    if (input.links) {
      // Delete existing links
      const deleteStmt = db.prepare('DELETE FROM links WHERE bundle_id = ?');
      deleteStmt.run(id);
      
      // Insert new links
      if (input.links.length > 0) {
        const linkStmt = db.prepare(
          'INSERT INTO links (id, bundle_id, url, title, description, image, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        
        for (const link of input.links) {
          linkStmt.run(
            uuidv4(),
            id,
            link.url,
            link.title || null,
            link.description || null,
            link.image || null,
            link.sort_order
          );
        }
      }
    }
  });
  
  updateTransaction();
  
  return getLinkBundleById(id);
}

export function deleteLinkBundle(id: string): boolean {
  const db = getDb();
  const stmt = db.prepare('DELETE FROM link_bundles WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function isVanityUrlAvailable(vanityUrl: string, excludeId?: string): boolean {
  const db = getDb();
  let stmt;
  let result;
  
  if (excludeId) {
    stmt = db.prepare('SELECT COUNT(*) as count FROM link_bundles WHERE vanity_url = ? AND id != ?');
    result = stmt.get(vanityUrl, excludeId) as { count: number };
  } else {
    stmt = db.prepare('SELECT COUNT(*) as count FROM link_bundles WHERE vanity_url = ?');
    result = stmt.get(vanityUrl) as { count: number };
  }
  
  return result.count === 0;
}
