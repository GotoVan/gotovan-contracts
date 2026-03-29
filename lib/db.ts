import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'gotovan.db');

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contracts (
      id TEXT PRIMARY KEY,
      reference TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('NAT_UK', 'NAT_ES', 'INT_UK_ES', 'INT_ES_UK')),
      language TEXT NOT NULL CHECK(language IN ('EN', 'ES', 'BILINGUAL')),
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'final')),
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT NOT NULL,
      client_address TEXT NOT NULL,
      collection_address TEXT NOT NULL,
      destination_address TEXT NOT NULL,
      removal_date TEXT NOT NULL,
      price REAL NOT NULL,
      items_description TEXT,
      annexe_filename TEXT,
      includes_packaging INTEGER NOT NULL DEFAULT 0,
      parking_within_25m INTEGER NOT NULL DEFAULT 0,
      elevator_required INTEGER NOT NULL DEFAULT 0,
      installation_required INTEGER NOT NULL DEFAULT 0,
      drive_file_id TEXT,
      created_by INTEGER REFERENCES users(id),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );
  `);
}