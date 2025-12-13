import type { Request, Response, NextFunction } from "express";

// Middleware to check if user is admin
export const adminMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = (req as any).user;

        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: "UNAUTHORIZED",
                    message: "Authentication required",
                },
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                error: {
                    code: "FORBIDDEN",
                    message: "Admin access required",
                },
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: {
                code: "INTERNAL_ERROR",
                message: "Error checking admin status",
            },
        });
    }
};
