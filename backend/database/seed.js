import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, 'products.json');
const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const count = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
if (count === 0) {
  const stmt = db.prepare(`
    INSERT INTO products (name, category, price, quantity, description)
    VALUES (?, ?, ?, ?, ?)
  `);
  products.forEach(p => stmt.run(p.name, p.category, p.price, p.quantity, p.description));
  console.log("Seed data inserted from JSON!");
} else {
  console.log("Products table already has data.");
}
