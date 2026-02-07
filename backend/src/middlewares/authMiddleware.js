import jwt from "jsonwebtoken"; // ✅ correct import
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
export const authenticate = (req, res, next) => {
    let token;
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    // Or from cookies
    if (!token && req.cookies?.token) {
        token = req.cookies.token;
    }
    // No token found
    if (!token) {
        console.log('AuthMiddleware: No token found in request');
        return res.status(401).json({ error: "No token provided" });
    }
    try {
        // Decode token (payload must contain userId + role)
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('AuthMiddleware: Token decoded successfully', { userId: decoded.userId, role: decoded.role });
        // Attach user object to request
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            role: decoded.role,
        };
        console.log('AuthMiddleware: User attached to request', req.user);
        return next();
    }
    catch (error) {
        console.log('AuthMiddleware: Token verification failed', error);
        const errorMessage = error instanceof Error ? error.message : 'Unexpected error';
        return res.status(401).json({ error: "Invalid token", details: errorMessage });
    }
};
export const authMiddleware = authenticate;
export const authenticateAdmin = (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') {
            res.status(403).json({ message: 'Admin access required' });
            return;
        }
        req.userId = decoded.userId;
        req.role = decoded.role;
        next();
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};
//# sourceMappingURL=authMiddleware.js.map