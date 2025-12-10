import Joi from "joi";

// eSewa payment initiation validation schema
export const esewaInitSchema = Joi.object({
    amount: Joi.number().positive().required().messages({
        "number.base": "Amount must be a number",
        "number.positive": "Amount must be positive",
        "any.required": "Amount is required",
    }),
    product_service_charge: Joi.number().min(0).default(0).messages({
        "number.base": "Service charge must be a number",
        "number.min": "Service charge must be non-negative",
    }),
    product_delivery_charge: Joi.number().min(0).default(0).messages({
        "number.base": "Delivery charge must be a number",
        "number.min": "Delivery charge must be non-negative",
    }),
    tax_amount: Joi.number().min(0).default(0).messages({
        "number.base": "Tax amount must be a number",
        "number.min": "Tax amount must be non-negative",
    }),
    success_url: Joi.string().uri().required().messages({
        "string.base": "Success URL must be a string",
        "string.uri": "Success URL must be a valid URI",
        "any.required": "Success URL is required",
    }),
    failure_url: Joi.string().uri().required().messages({
        "string.base": "Failure URL must be a string",
        "string.uri": "Failure URL must be a valid URI",
        "any.required": "Failure URL is required",
    }),
    cancelled_url: Joi.string().uri().required().messages({
        "string.base": "Cancelled URL must be a string",
        "string.uri": "Cancelled URL must be a valid URI",
        "any.required": "Cancelled URL is required",
    }),
    total_amount: Joi.number().positive().required().messages({
        "number.base": "Total amount must be a number",
        "number.positive": "Total amount must be positive",
        "any.required": "Total amount is required",
    }),
});

// Khalti payment initiation validation schema
export const khaltiInitSchema = Joi.object({
    return_url: Joi.string().uri().required().messages({
        "string.base": "Return URL must be a string",
        "string.uri": "Return URL must be a valid URI",
        "any.required": "Return URL is required",
    }),
    website_url: Joi.string().uri().required().messages({
        "string.base": "Website URL must be a string",
        "string.uri": "Website URL must be a valid URI",
        "any.required": "Website URL is required",
    }),
    amount: Joi.number().integer().positive().required().messages({
        "number.base": "Amount must be a number",
        "number.integer": "Amount must be an integer (in paisa)",
        "number.positive": "Amount must be positive",
        "any.required": "Amount is required",
    }),
    purchase_order_id: Joi.string().required().messages({
        "string.base": "Purchase order ID must be a string",
        "string.empty": "Purchase order ID is required",
        "any.required": "Purchase order ID is required",
    }),
    purchase_order_name: Joi.string().optional().messages({
        "string.base": "Purchase order name must be a string",
    }),
});

// eSewa verification schema
export const esewaVerifySchema = Joi.object({
    amt: Joi.number().positive().required(),
    rid: Joi.string().required(),
    pid: Joi.string().required(),
    scd: Joi.string().required(),
});

// Khalti verification schema
export const khaltiVerifySchema = Joi.object({
    token: Joi.string().required(),
    amount: Joi.number().integer().positive().required(),
});

// Payment status update schema
export const paymentStatusSchema = Joi.object({
    orderId: Joi.number().integer().positive().required().messages({
        "number.base": "Order ID must be a number",
        "number.integer": "Order ID must be an integer",
        "number.positive": "Order ID must be positive",
        "any.required": "Order ID is required",
    }),
    status: Joi.string().valid('pending', 'paid', 'failed', 'cancelled').required().messages({
        "string.base": "Status must be a string",
        "any.only": "Status must be one of: pending, paid, failed, cancelled",
        "any.required": "Status is required",
    }),
});
