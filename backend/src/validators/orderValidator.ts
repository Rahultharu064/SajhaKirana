import Joi from "joi";

// Create order (checkout) validation schema
export const createOrderSchema = Joi.object({
    userId: Joi.number().integer().positive().required().messages({
        "number.base": "User ID must be a number",
        "number.positive": "User ID must be a positive number",
        "any.required": "User ID is required",
    }),
    shippingAddress: Joi.object().unknown().required().messages({
        "object.base": "Shipping address must be an object",
        "any.required": "Shipping address is required",
    }),
    paymentMethod: Joi.string().valid('cod', 'esewa', 'khalti').required().messages({
        "string.base": "Payment method must be a string",
        "any.only": "Payment method must be cod, esewa, or khalti",
        "any.required": "Payment method is required",
    }),
    items: Joi.array().items(
        Joi.object({
            sku: Joi.string().required(),
            qty: Joi.number().integer().min(1).required(),
            price: Joi.number().min(0).required(),
        })
    ).min(1).required().messages({
        "array.base": "Items must be an array",
        "array.min": "Items cannot be empty",
        "any.required": "Items are required",
    }),
    couponCode: Joi.string().optional(),
});

// Update order status validation schema
export const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid('pending', 'processing', 'confirmed', 'shipped', 'delivered', 'cancelled').required().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be one of: pending, processing, confirmed, shipped, delivered, cancelled",
        "any.required": "Status is required",
    }),
});

// Confirm delivery validation schema
export const confirmDeliverySchema = Joi.object({
    otp: Joi.string().length(6).required().messages({
        "string.base": "OTP must be a string",
        "string.length": "OTP must be 6 characters",
        "any.required": "OTP is required",
    }),
});
