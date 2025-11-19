import Database from 'better-sqlite3';
const db = new Database('products.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT,
    price INTEGER,
    quantity INTEGER,
    description TEXT
  )
`).run();

export default db;
