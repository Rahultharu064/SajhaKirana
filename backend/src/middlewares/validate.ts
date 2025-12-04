import type { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Generic validation middleware factory
export const validate = (schema: Joi.ObjectSchema, property: "body" | "params" | "query" = "body") => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true // Remove unknown properties
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Replace request property with validated value
        req[property] = value;
        next();
    };
};
