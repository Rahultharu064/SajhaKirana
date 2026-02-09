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
  updateProductStock,
  getAutocompleteSuggestions,
  getFacets,
  searchByImage,
  getProductsWithDeals,
} from "../controllers/productController";
import { validate } from "../middlewares/validate";
import {
  createProductSchema,
  createProductMultipartSchema, // Import the new schema
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
  validate(createProductMultipartSchema, "body"), // Use Multipart schema
  createProduct
);

// Get all products with filters and pagination
productRoutes.get(
  "/",
  // temporarily disable validation to debug
  // validate(searchProductSchema, "query"),
  getAllProducts
);

// Get products with deals
productRoutes.get("/deals", getProductsWithDeals);

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

// Update product stock
productRoutes.patch(
  "/:id/stock",
  validate(idParamSchema, "params"),
  updateProductStock
);

// Bulk import products
productRoutes.post(
  "/bulk/import",
  validate(createProductSchema, "body"),
  bulkImportProducts
);

// Get autocomplete suggestions
productRoutes.get("/autocomplete", getAutocompleteSuggestions);

// Get facets for advanced filtering
productRoutes.get("/facets", getFacets);

// Search by image
productRoutes.post("/search/image", searchByImage);

export default productRoutes;
