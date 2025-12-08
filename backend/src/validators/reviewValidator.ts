import Joi from "joi";

// Create review validation schema
export const createReviewSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "number.base": "Product ID must be a number",
    "number.positive": "Product ID must be a positive number",
    "any.required": "Product ID is required",
  }),
  rating: Joi.number().integer().min(0).max(5).required().messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 0",
    "number.max": "Rating cannot exceed 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().trim().min(10).max(1000).required().messages({
    "string.empty": "Review comment is required",
    "string.min": "Review comment must be at least 10 characters",
    "string.max": "Review comment cannot exceed 1000 characters",
    "any.required": "Review comment is required",
  }),
});

// Update review validation schema
export const updateReviewSchema = Joi.object({
  rating: Joi.number().integer().min(0).max(5).messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 0",
    "number.max": "Rating cannot exceed 5",
  }),
  comment: Joi.string().trim().min(10).max(1000).messages({
    "string.min": "Review comment must be at least 10 characters",
    "string.max": "Review comment cannot exceed 1000 characters",
  }),
}).or('rating', 'comment').messages({
  "object.missing": "At least one field (rating or comment) must be provided for update",
});

// Review ID parameter validation schema
export const reviewIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "Review ID must be a number",
    "number.positive": "Review ID must be a positive number",
    "any.required": "Review ID is required",
  }),
});

// Product ID parameter validation schema
export const productIdParamSchema = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "number.base": "Product ID must be a number",
    "number.positive": "Product ID must be a positive number",
    "any.required": "Product ID is required",
  }),
});

// Search and filter reviews validation schema
export const searchReviewsSchema = Joi.object({
  productId: Joi.number().integer().positive().messages({
    "number.base": "Product ID must be a number",
    "number.positive": "Product ID must be a positive number",
  }),
  userId: Joi.number().integer().positive().messages({
    "number.base": "User ID must be a number",
    "number.positive": "User ID must be a positive number",
  }),
  rating: Joi.number().integer().min(0).max(5).messages({
    "number.base": "Rating must be a number",
    "number.integer": "Rating must be an integer",
    "number.min": "Rating must be at least 0",
    "number.max": "Rating cannot exceed 5",
  }),
  sort: Joi.string()
    .valid("newest", "oldest", "highest", "lowest")
    .default("newest")
    .messages({
      "any.only": 'Sort must be one of: newest, oldest, highest, lowest',
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
});
