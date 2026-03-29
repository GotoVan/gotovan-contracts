import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'gotovan.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const users = [
  { email: 'juan@gotovan.co.uk', name: 'Juan', password: 'CHANGE_ME_1' },
  { email: 'colleague@gotovan.co.uk', name: 'Colleague', password: 'CHANGE_ME_2' },
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO users (email, password_hash, name)
  VALUES (@email, @password_hash, @name)
`);

for (const user of users) {
  const hash = bcrypt.hashSync(user.password, 12);
  insert.run({ email: user.email, password_hash: hash, name: user.name });
  console.log(`✓ User created: ${user.email}`);
}

db.close();
console.log('Seed complete.');