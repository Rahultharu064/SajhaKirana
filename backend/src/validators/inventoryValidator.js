import Joi from "joi";
// Adjust stock validation schema
export const adjustStockSchema = Joi.object({
    sku: Joi.string().required().trim().messages({
        "string.empty": "SKU is required",
        "any.required": "SKU is required",
    }),
    qty: Joi.number().integer().required().messages({
        "number.base": "Quantity must be a number",
        "number.integer": "Quantity must be an integer",
        "any.required": "Quantity is required",
    }),
    type: Joi.string().valid("add", "subtract", "set").required().messages({
        "any.only": 'Type must be one of: add, subtract, set',
        "any.required": "Type is required",
    }),
    note: Joi.string().optional().max(500).messages({
        "string.max": "Note cannot exceed 500 characters",
    }),
});
// Reserve stock validation schema
export const reserveStockSchema = Joi.object({
    orderId: Joi.string().required().trim().messages({
        "string.empty": "Order ID is required",
        "any.required": "Order ID is required",
    }),
    items: Joi.array()
        .items(Joi.object({
        sku: Joi.string().required().trim().messages({
            "string.empty": "SKU is required",
        }),
        qty: Joi.number().integer().positive().required().messages({
            "number.base": "Quantity must be a number",
            "number.integer": "Quantity must be an integer",
            "number.positive": "Quantity must be positive",
            "any.required": "Quantity is required",
        }),
    }))
        .min(1)
        .required()
        .messages({
        "array.base": "Items must be an array",
        "array.min": "At least one item is required",
        "any.required": "Items are required",
    }),
});
// Commit reservation validation schema
export const commitReservationSchema = Joi.object({
    orderId: Joi.string().required().trim().messages({
        "string.empty": "Order ID is required",
        "any.required": "Order ID is required",
    }),
});
// Release reservation validation schema
export const releaseReservationSchema = Joi.object({
    orderId: Joi.string().required().trim().messages({
        "string.empty": "Order ID is required",
        "any.required": "Order ID is required",
    }),
});
// SKU parameter validation schema
export const skuParamSchema = Joi.object({
    sku: Joi.string().required().trim().messages({
        "string.empty": "SKU is required",
    }),
});
//# sourceMappingURL=inventoryValidator.js.map