import Joi from "joi";



// Add to cart validation schema
export const addtoCartSchema = Joi.object({
    productId: Joi.number().integer().positive().required().messages({
        "number.base": "Product ID must be a number",
        "number.positive": "Product ID must be a positive number",
        "any.required": "Product ID is required",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required",
    }),
})


// Remove from cart validation schema
export const removeFromCartSchema = Joi.object({
    productId: Joi.number().integer().positive().required().messages({
        "number.base": "Product ID must be a number",
        "number.positive": "Product ID must be a positive number",
        "any.required": "Product ID is required",
    }),
    quantity: Joi.number().integer().min(1).required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "number.min": "Quantity must be at least 1",
        "any.required": "Quantity is required",
    }),
})
