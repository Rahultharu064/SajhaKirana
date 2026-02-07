import type { Request, Response, NextFunction } from 'express';
/**
 * Middleware to check if the authenticated user has the required role
 * @param allowedRoles - Array of roles that are allowed to access the route
 */
export declare const requireRole: (allowedRoles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to check if user is an admin
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to check if user is a customer
 */
export declare const requireCustomer: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to allow both admin and customer
 */
export declare const requireAuthenticated: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=roleMiddleware.d.ts.map