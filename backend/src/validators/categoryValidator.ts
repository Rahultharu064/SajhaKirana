import Joi from "joi";

// Create category validation schema
export const createCategorySchema = Joi.object({
    name: Joi.string().required().min(2).max(100).messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 2 characters",
        "string.max": "Category name cannot exceed 100 characters"
    })
});

// Update category validation schema
export const updateCategorySchema = Joi.object({
    name: Joi.string().required().min(2).max(100).messages({
        "string.empty": "Category name is required",
        "string.min": "Category name must be at least 2 characters",
        "string.max": "Category name cannot exceed 100 characters"
    })
});

// ID parameter validation schema
export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        "number.base": "ID must be a number",
        "number.positive": "ID must be a positive number",
        "any.required": "ID is required"
    })
});
