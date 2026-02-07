import Joi from "joi";
// Create coupon validation schema
export const createCouponSchema = Joi.object({
    code: Joi.string().uppercase().min(3).max(20).required().messages({
        "string.base": "Coupon code must be a string",
        "string.empty": "Coupon code is required",
        "string.min": "Coupon code must be at least 3 characters",
        "string.max": "Coupon code cannot exceed 20 characters",
        "any.required": "Coupon code is required",
    }),
    description: Joi.string().min(5).max(255).required().messages({
        "string.base": "Description must be a string",
        "string.empty": "Description is required",
        "string.min": "Description must be at least 5 characters",
        "string.max": "Description cannot exceed 255 characters",
        "any.required": "Description is required",
    }),
    discountType: Joi.string().valid('percentage', 'fixed').required().messages({
        "string.base": "Discount type must be a string",
        "any.only": "Discount type must be either 'percentage' or 'fixed'",
        "any.required": "Discount type is required",
    }),
    discountValue: Joi.number().positive().required().custom((value, helpers) => {
        const discountType = helpers.state.ancestors[1]?.discountType;
        if (discountType === 'percentage' && value > 100) {
            return helpers.error('number.max', { limit: 100 });
        }
        return value;
    }).messages({
        "number.base": "Discount value must be a number",
        "number.positive": "Discount value must be positive",
        "number.max": "Percentage discount cannot exceed 100%",
        "any.required": "Discount value is required",
    }),
    minOrderValue: Joi.number().min(0).default(0).messages({
        "number.base": "Minimum order value must be a number",
        "number.min": "Minimum order value cannot be negative",
    }),
    maxDiscount: Joi.when('discountType', {
        is: 'percentage',
        then: Joi.number().positive().messages({
            "number.base": "Maximum discount must be a number",
            "number.positive": "Maximum discount must be positive",
        }),
        otherwise: Joi.forbidden(),
    }),
    usageLimit: Joi.number().integer().min(0).default(0).messages({
        "number.base": "Usage limit must be a number",
        "number.integer": "Usage limit must be an integer",
        "number.min": "Usage limit cannot be negative",
    }),
    expiryDate: Joi.date().greater('now').required().messages({
        "date.base": "Expiry date must be a valid date",
        "date.greater": "Expiry date must be in the future",
        "any.required": "Expiry date is required",
    }),
    isActive: Joi.boolean().default(true).messages({
        "boolean.base": "Active status must be a boolean",
    }),
});
// Update coupon validation schema
export const updateCouponSchema = Joi.object({
    code: Joi.string().uppercase().min(3).max(20).messages({
        "string.base": "Coupon code must be a string",
        "string.empty": "Coupon code cannot be empty",
        "string.min": "Coupon code must be at least 3 characters",
        "string.max": "Coupon code cannot exceed 20 characters",
    }),
    description: Joi.string().min(5).max(255).messages({
        "string.base": "Description must be a string",
        "string.empty": "Description cannot be empty",
        "string.min": "Description must be at least 5 characters",
        "string.max": "Description cannot exceed 255 characters",
    }),
    discountType: Joi.string().valid('percentage', 'fixed').messages({
        "string.base": "Discount type must be a string",
        "any.only": "Discount type must be either 'percentage' or 'fixed'",
    }),
    discountValue: Joi.number().positive().messages({
        "number.base": "Discount value must be a number",
        "number.positive": "Discount value must be positive",
    }),
    minOrderValue: Joi.number().min(0).messages({
        "number.base": "Minimum order value must be a number",
        "number.min": "Minimum order value cannot be negative",
    }),
    maxDiscount: Joi.when('discountType', {
        is: 'percentage',
        then: Joi.number().positive().messages({
            "number.base": "Maximum discount must be a number",
            "number.positive": "Maximum discount must be positive",
        }),
        otherwise: Joi.forbidden(),
    }),
    usageLimit: Joi.number().integer().min(0).messages({
        "number.base": "Usage limit must be a number",
        "number.integer": "Usage limit must be an integer",
        "number.min": "Usage limit cannot be negative",
    }),
    expiryDate: Joi.date().greater('now').messages({
        "date.base": "Expiry date must be a valid date",
        "date.greater": "Expiry date must be in the future",
    }),
    isActive: Joi.boolean().messages({
        "boolean.base": "Active status must be a boolean",
    }),
});
// Apply coupon validation schema
export const applyCouponSchema = Joi.object({
    code: Joi.string().uppercase().required().messages({
        "string.base": "Coupon code must be a string",
        "string.empty": "Coupon code is required",
        "any.required": "Coupon code is required",
    }),
    orderValue: Joi.number().positive().required().messages({
        "number.base": "Order value must be a number",
        "number.positive": "Order value must be positive",
        "any.required": "Order value is required",
    }),
});
//# sourceMappingURL=couponValidator.js.map