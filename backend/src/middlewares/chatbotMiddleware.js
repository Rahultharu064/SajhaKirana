import { redis } from '../config/redis';
const RATE_LIMIT_WINDOW = 60; // 1 minute
const MAX_REQUESTS = 20; // 20 requests per minute
export async function rateLimitChatbot(req, res, next) {
    try {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const key = `rate_limit:chatbot:${ip}`;
        const requests = await redis.incr(key);
        if (requests === 1) {
            await redis.expire(key, RATE_LIMIT_WINDOW);
        }
        if (requests > MAX_REQUESTS) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests. Please try again later.',
            });
        }
        next();
    }
    catch (error) {
        console.error('Rate limit error:', error);
        next();
    }
}
//# sourceMappingURL=chatbotMiddleware.js.map