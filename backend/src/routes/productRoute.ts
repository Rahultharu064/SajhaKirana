import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsByCategory,
  bulkImportProducts,
} from "../controllers/productController";
import { validate } from "../middlewares/validate";
import {
  createProductSchema,
  updateProductSchema,
  idParamSchema,
  searchProductSchema,
} from "../validators/productValidator";
import { uploadProducts } from "../config/multer";

const productRoutes = Router();

// Create product with validation and image upload (multiple files)
productRoutes.post(
  "/",
  uploadProducts.array("images", 10),
  validate(createProductSchema, "body"),
  createProduct
);

// Get all products with filters and pagination
productRoutes.get(
  "/",
  validate(searchProductSchema, "query"),
  getAllProducts
);

// Search products
productRoutes.get(
  "/search",
  validate(searchProductSchema, "query"),
  searchProducts
);

// Get products by category with validation
productRoutes.get(
  "/category/:categoryId",
  validate(searchProductSchema, "query"),
  getProductsByCategory
);

// Get product by slug
productRoutes.get("/slug/:slug", getProductBySlug);

// Get product by ID with validation
productRoutes.get(
  "/:id",
  validate(idParamSchema, "params"),
  getProductById
);

// Update product with validation and optional image upload
productRoutes.put(
  "/:id",
  uploadProducts.array("images", 10),
  validate(idParamSchema, "params"),
  validate(updateProductSchema, "body"),
  updateProduct
);

// Delete product with validation
productRoutes.delete(
  "/:id",
  validate(idParamSchema, "params"),
  deleteProduct
);

// Bulk import products
productRoutes.post(
  "/bulk/import",
  validate(createProductSchema, "body"),
  bulkImportProducts
);

export default productRoutes;
