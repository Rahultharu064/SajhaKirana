import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;

export const redis = redisUrl
    ? new Redis(redisUrl, {
        tls: {}
    })
    : new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        
        db: 0,
    });

redis.on('connect', () => {
    console.log('✅ Redis connected');
});

redis.on('error', (err) => {
    console.error('❌ Redis error:', err);
});

export default redis;
