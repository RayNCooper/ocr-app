import { createClient, RedisClientType } from 'redis'

// Singleton Redis client
class RedisClient {
    private static instance: RedisClientType | null = null

    private constructor() { }

    public static async getInstance() {
        if (!RedisClient.instance) {
            RedisClient.instance = createClient({
                url: process.env.REDIS_URL || 'redis://localhost:6379',
                password: process.env.REDIS_PASSWORD || '',
            })

            RedisClient.instance.on('error', (err) => {
                // Here we could add error tracking in the future such as Sentry, for now we just log
                console.error('Redis Client Error:', err)
            })

            await RedisClient.instance.connect()
        }

        return RedisClient.instance
    }
}

export default RedisClient