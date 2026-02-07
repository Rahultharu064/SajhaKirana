/**
 * Middleware to check if the authenticated user has the required role
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }
        const userRole = user.role || 'customer';
        if (!allowedRoles.includes(userRole)) {
            res.status(403).json({
                success: false,
                message: 'Access denied',
                error: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
            });
            return;
        }
        next();
    };
};
/**
 * Middleware to check if user is an admin
 */
export const requireAdmin = requireRole(['admin']);
/**
 * Middleware to check if user is a customer
 */
export const requireCustomer = requireRole(['customer']);
/**
 * Middleware to allow both admin and customer
 */
export const requireAuthenticated = requireRole(['admin', 'customer']);
//# sourceMappingURL=roleMiddleware.js.map