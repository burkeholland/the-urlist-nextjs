import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) {
    return db;
  }

  // Ensure data directory exists
  const dbPath = join(process.cwd(), 'data', 'urlist.db');
  
  // Create database connection
  db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');
  
  // Initialize schema if needed
  initializeSchema(db);
  
  return db;
}

function initializeSchema(database: Database.Database) {
  const schemaPath = join(process.cwd(), 'db', 'schema.sql');
  const schema = readFileSync(schemaPath, 'utf-8');
  
  // Execute schema
  database.exec(schema);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
