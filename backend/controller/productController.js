import db from "../database/db.js";
import { productSchema } from "../utils/validation/productValidation.js";
const getAllProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const category = req.query.category || '';
  const minPrice = parseInt(req.query.minPrice) || 0;
  const maxPrice = parseInt(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;

  try {
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
      whereClause += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    if (minPrice > 0) {
      whereClause += ' AND price >= ?';
      params.push(minPrice);
    }

    if (maxPrice < Number.MAX_SAFE_INTEGER) {
      whereClause += ' AND price <= ?';
      params.push(maxPrice);
    }

    const productsQuery = `SELECT * FROM products ${whereClause} LIMIT ? OFFSET ?`;
    const totalQuery = `SELECT COUNT(*) as count FROM products ${whereClause}`;

    const products = db.prepare(productsQuery).all(...params, limit, offset);
    const total = db.prepare(totalQuery).get(...params).count;

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: products
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getProductById = (req, res) => {
  const { id } = req.params;
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id);
  if (product) {
    res.status(200).json(product);
  }
  else {
    res.status(404).json({ message: "Product not found" });
  }
};

const createProduct = (req, res) => {
  const { error, value } = productSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const {name, category, price, quantity, description} = value;
  const products = db.prepare("INSERT INTO products (name, category, price, quantity, description) VALUES (?, ?, ?, ?, ?)").run(name, category, price, quantity, description);
  res.status(201).json( products.lastInsertRowid);
}
const updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, category, price, quantity, description } = req.body;
  const result = db.prepare("UPDATE products SET name = ?, category = ?, price = ?, quantity = ?, description = ? WHERE id = ?").run(name, category, price, quantity, description, id);
  if (result.changes) {
    res.status(200).json({ message: "Product updated successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);
  if (result.changes) {
    res.status(200).json({ message: "Product deleted successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

const getCategories = (req, res) => {
  try {
    const categories = db
      .prepare("SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ''")
      .all()
      .map(row => row.category);

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createProduct, deleteProduct, getAllProducts, getCategories, getProductById, updateProduct };

