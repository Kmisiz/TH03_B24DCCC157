import express from 'express';
import { createProduct, deleteProduct, getAllProducts, getCategories, getProductById, updateProduct } from '../controller/productController.js';
const router = express.Router();

router.get("/", getAllProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;