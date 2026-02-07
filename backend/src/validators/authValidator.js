import Joi from "joi";
// Register validation schema
export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(30).required().messages({
        "string.base": "Name must be a string",
        "string.empty": "Name is required",
        "string.min": "Name must be at least 3 characters",
        "string.max": "Name cannot exceed 30 characters",
        "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
    }),
    phone: Joi.alternatives().try(Joi.string().allow('').length(0), Joi.string().pattern(/^[0-9]{10,15}$/)).optional().messages({
        "string.base": "Phone number must be a string",
        "string.pattern.base": "Phone number must be between 10 to 15 digits",
    }),
});
// Login validation schema
export const loginSchema = Joi.object({
    identifier: Joi.string().required().messages({
        "string.base": "Identifier must be a string",
        "string.empty": "Identifier is required",
        "any.required": "Identifier is required",
    }),
    password: Joi.string().required().messages({
        "string.base": "Password must be a string",
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
});
// Password reset validation schema
export const passwordResetSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.base": "Email must be a string",
        "string.email": "Email must be a valid email",
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
});
// Reset password validation schema
export const resetPasswordSchema = Joi.object({
    token: Joi.string().required().messages({
        "string.base": "Token must be a string",
        "string.empty": "Token is required",
        "any.required": "Token is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
        "string.base": "New password must be a string",
        "string.empty": "New password is required",
        "string.min": "New password must be at least 6 characters",
        "any.required": "New password is required",
    }),
});
// Email verification validation schema
export const verifyEmailSchema = Joi.object({
    token: Joi.string().required().messages({
        "string.base": "Verification token must be a string",
        "string.empty": "Verification token is required",
        "any.required": "Verification token is required",
    }),
});
//# sourceMappingURL=authValidator.js.map