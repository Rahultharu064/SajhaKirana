import Joi from "joi";



// Add to cart validation schema
export const addtoCartSchema = Joi.object({
    userId: Joi.number().integer().positive().required().messages({
        "number.base": "User ID must be a number",
        "number.positive": "User ID must be a positive number",
        "any.required": "User ID is required",
    }),
    sku: Joi.string().required().messages({
        "string.base": "SKU must be a string",
        "any.required": "SKU is required",
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
    cartItemId: Joi.number().integer().positive().required().messages({
        "number.base": "Cart Item ID must be a number",
        "number.positive": "Cart Item ID must be a positive number",
        "any.required": "Cart Item ID is required",
    }),
})
