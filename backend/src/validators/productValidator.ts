import Joi from "joi";

// Create product validation schema
export const createProductSchema = Joi.object({
  title: Joi.string().required().min(3).max(255).trim().messages({
    "string.empty": "Product title is required",
    "string.min": "Product title must be at least 3 characters",
    "string.max": "Product title cannot exceed 255 characters",
  }),
  slug: Joi.string()
    .required()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .min(3)
    .max(255)
    .messages({
      "string.empty": "Product slug is required",
      "string.pattern.base":
        "Slug must contain only lowercase letters, numbers, and hyphens",
      "string.min": "Slug must be at least 3 characters",
      "string.max": "Slug cannot exceed 255 characters",
    }),
  description: Joi.string().required().min(10).max(5000).messages({
    "string.empty": "Product description is required",
    "string.min": "Product description must be at least 10 characters",
    "string.max": "Product description cannot exceed 5000 characters",
  }),
  price: Joi.number().positive().precision(2).required().messages({
    "number.base": "Price must be a number",
    "number.positive": "Price must be greater than 0",
    "any.required": "Price is required",
  }),
  mrp: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      "number.base": "MRP must be a number",
      "number.positive": "MRP must be greater than 0",
      "any.required": "MRP is required",
    }),
  stock: Joi.number().integer().min(0).default(0).messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
  }),
  categoryId: Joi.number().integer().positive().required().messages({
    "number.base": "Category ID must be a number",
    "number.positive": "Category ID must be a positive number",
    "any.required": "Category ID is required",
  }),
  images: Joi.array()
    .items(
      Joi.string()
        .uri()
        .messages({
          "string.uri": "Each image must be a valid URI/URL",
        })
    )
    .min(1)
    .max(10)
    .messages({
      "array.base": "Images must be an array",
      "array.min": "At least one image is required",
      "array.max": "Maximum 10 images allowed",
    }),
  isActive: Joi.boolean().default(true).messages({
    "boolean.base": "isActive must be a boolean value",
  }),
});

// Update product validation schema
export const updateProductSchema = Joi.object({
  title: Joi.string().min(3).max(255).trim().messages({
    "string.min": "Product title must be at least 3 characters",
    "string.max": "Product title cannot exceed 255 characters",
  }),
  slug: Joi.string()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .min(3)
    .max(255)
    .messages({
      "string.pattern.base":
        "Slug must contain only lowercase letters, numbers, and hyphens",
      "string.min": "Slug must be at least 3 characters",
      "string.max": "Slug cannot exceed 255 characters",
    }),
  description: Joi.string().min(10).max(5000).messages({
    "string.min": "Product description must be at least 10 characters",
    "string.max": "Product description cannot exceed 5000 characters",
  }),
  price: Joi.number()
    .positive()
    .precision(2)
    .when("mrp", {
      is: Joi.exist(),
      then: Joi.number().max(Joi.ref("mrp")),
    })
    .messages({
      "number.base": "Price must be a number",
      "number.positive": "Price must be greater than 0",
      "number.max": "Price must be less than or equal to MRP",
    }),
  mrp: Joi.number()
    .positive()
    .precision(2)
    .messages({
      "number.base": "MRP must be a number",
      "number.positive": "MRP must be greater than 0",
    }),
  stock: Joi.number().integer().min(0).messages({
    "number.base": "Stock must be a number",
    "number.integer": "Stock must be an integer",
    "number.min": "Stock cannot be negative",
  }),
  categoryId: Joi.number().integer().positive().messages({
    "number.base": "Category ID must be a number",
    "number.positive": "Category ID must be a positive number",
  }),
  images: Joi.array()
    .items(
      Joi.string()
        .uri()
        .messages({
          "string.uri": "Each image must be a valid URI/URL",
        })
    )
    .min(1)
    .max(10)
    .messages({
      "array.base": "Images must be an array",
      "array.min": "At least one image is required",
      "array.max": "Maximum 10 images allowed",
    }),
  isActive: Joi.boolean().messages({
    "boolean.base": "isActive must be a boolean value",
  }),
});

// ID parameter validation schema
export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "number.positive": "ID must be a positive number",
    "any.required": "ID is required",
  }),
});

// Search and filter validation schema
export const searchProductSchema = Joi.object({
  q: Joi.string().trim().max(100).messages({
    "string.max": "Search query cannot exceed 100 characters",
  }),
  category: Joi.number().integer().positive().messages({
    "number.base": "Category ID must be a number",
    "number.positive": "Category ID must be a positive number",
  }),
  priceMin: Joi.number().precision(2).min(0).messages({
    "number.base": "Minimum price must be a number",
    "number.min": "Minimum price cannot be negative",
  }),
  priceMax: Joi.number()
    .precision(2)
    .min(0)
    .when("priceMin", {
      is: Joi.exist(),
      then: Joi.number().min(Joi.ref("priceMin")),
    })
    .messages({
      "number.base": "Maximum price must be a number",
      "number.min": "Maximum price must be greater than minimum price",
    }),
  sort: Joi.string()
    .valid("newest", "oldest", "priceLow", "priceHigh", "popular")
    .messages({
      "any.only":
        'Sort must be one of: newest, oldest, priceLow, priceHigh, popular',
    }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
  isActive: Joi.boolean().messages({
    "boolean.base": "isActive must be a boolean value",
  }),
});
