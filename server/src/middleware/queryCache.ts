import { Request, Response, NextFunction } from 'express'
import { getRedisClient } from '../config/redis.js'
import { generateCacheKey, getFromCache, setInCache } from '../utils/cache.js'

/**
 * Cache database query results
 * Use this middleware before routes that perform expensive database queries
 */
export const queryCacheMiddleware = (options: {
  prefix: string
  ttl?: number
  keyGenerator?: (req: Request) => string
  skipCache?: (req: Request) => boolean
}) => {
  const { prefix, ttl = 3600, keyGenerator, skipCache } = options

  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching if condition is met
    if (skipCache && skipCache(req)) {
      return next()
    }

    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    try {
      const redis = getRedisClient()
      if (!redis) {
        return next()
      }

      // Generate cache key
      const cacheKey = keyGenerator
        ? keyGenerator(req)
        : generateCacheKey(prefix, {
            path: req.path,
            query: req.query,
            params: req.params,
          })

      // Try to get from cache
      const cached = await getFromCache<any>(cacheKey)
      if (cached !== null) {
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Cache-Key', cacheKey)
        return res.status(200).json(cached)
      }

      // Store original json method
      const originalJson = res.json.bind(res)
      res.setHeader('X-Cache', 'MISS')
      res.setHeader('X-Cache-Key', cacheKey)

      // Override json to cache response
      res.json = function (body: any) {
        // Only cache successful responses
        if (res.statusCode === 200 && body) {
          setInCache(cacheKey, body, ttl).catch((err) => {
            console.error('Query cache set error:', err)
          })
        }
        return originalJson(body)
      }

      next()
    } catch (error) {
      console.error('Query cache middleware error:', error)
      next()
    }
  }
}

/**
 * Invalidate query cache after mutations
 */
export const invalidateQueryCache = (patterns: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = getRedisClient()
      if (!redis) {
        return next()
      }

      for (const pattern of patterns) {
        // Replace :id with actual id
        const cachePattern = pattern.replace(':id', req.params.id || '*')
        await redis.eval(
          `local keys = redis.call('keys', ARGV[1])
           if #keys > 0 then
             return redis.call('del', unpack(keys))
           else
             return 0
           end`,
          0,
          `cache:${cachePattern}*`
        )
      }

      next()
    } catch (error) {
      console.error('Invalidate query cache error:', error)
      next()
    }
  }
}
