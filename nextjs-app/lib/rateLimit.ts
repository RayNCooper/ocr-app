import RedisClient from "@/lib/redisClient"

export class RateLimit {
  static async check(): Promise<{ allowed: boolean; count: number }> {
    const redis = await RedisClient.getInstance()
    
    const count = await redis.get('upload_count') || '0'
    const uploads = parseInt(count)
    
    return { allowed: uploads < 5, count: uploads }
  }

  static async record(): Promise<void> {
    const redis = await RedisClient.getInstance()
    
    await redis.incr('upload_count')
    await redis.expire('upload_count', 60 * 60) // 1 hour
  }
}