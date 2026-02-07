import Joi from "joi";
// Generic validation middleware factory
export const validate = (schema, property = "body") => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property], {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true // Remove unknown properties
        });
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join("."),
                message: detail.message
            }));
            // Log validation errors
            console.error(`Validation Error [${property}]:`, JSON.stringify(errors, null, 2));
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }
        // Replace request property with validated value
        if (property !== 'query') {
            req[property] = value;
        }
        next();
    };
};
//# sourceMappingURL=validate.js.map