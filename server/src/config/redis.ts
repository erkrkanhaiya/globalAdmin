import Redis from 'ioredis'
import { config } from './env.js'

let redisClient: Redis | null = null

export const createRedisClient = (): Redis => {
  if (redisClient) {
    return redisClient
  }

  const options: any = {
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    db: config.REDIS_DB,
    lazyConnect: true, // Don't connect immediately
    enableOfflineQueue: false, // Don't queue commands when offline
    maxRetriesPerRequest: null, // Don't retry failed requests
    retryStrategy: (times: number) => {
      // Stop retrying after a few attempts
      if (times > 3) {
        return null // Stop retrying
      }
      const delay = Math.min(times * 50, 2000)
      return delay
    },
  }

  if (config.REDIS_PASSWORD) {
    options.password = config.REDIS_PASSWORD
  }

  redisClient = new Redis(options)

  // Try to connect, but don't fail if it doesn't work
  redisClient.connect().catch(() => {
    // Silently ignore connection failures - Redis is optional
  })

  redisClient.on('connect', () => {
    console.log('✅ Redis Connected')
  })

  redisClient.on('error', (error: any) => {
    // Silently handle Redis errors - Redis is optional
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      // Redis is not running - this is OK, it's optional
      // Don't log as error, just silently ignore
    } else {
      console.log('⚠️  Redis error (optional service):', error.message)
    }
    // Don't crash the app - Redis is optional
  })

  redisClient.on('close', () => {
    // Silently handle close - Redis is optional
  })

  redisClient.on('ready', () => {
    console.log('✅ Redis Ready')
  })

  return redisClient
}

export const getRedisClient = (): Redis | null => {
  return redisClient
}

export const closeRedisConnection = async (): Promise<void> => {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}

