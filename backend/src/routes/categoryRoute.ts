import { Router } from "express";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} from "../controllers/categoryController";
import { validate } from "../middlewares/validate";
import { uploadCategories } from "../config/multer";
import {
    createCategorySchema,
    updateCategorySchema,
    idParamSchema
} from "../validators/categoryValidator";

const categoryRoutes = Router();

// Create category with file upload and validation
categoryRoutes.post(
    "/",
    uploadCategories.single("image"),
    validate(createCategorySchema, "body"),
    createCategory
);

// Get all categories
categoryRoutes.get("/", getAllCategories);

// Get category by ID with validation
categoryRoutes.get(
    "/:id",
    validate(idParamSchema, "params"),
    getCategoryById
);

// Update category with validation
categoryRoutes.put(
    "/:id",
    validate(idParamSchema, "params"),
    validate(updateCategorySchema, "body"),
    updateCategory
);

// Delete category with validation
categoryRoutes.delete(
    "/:id",
    validate(idParamSchema, "params"),
    deleteCategory
);

export default categoryRoutes;
