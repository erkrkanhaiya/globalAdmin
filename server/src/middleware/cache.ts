import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { getRedisClient } from '../config/redis.js'
import { generateCacheKey } from '../utils/cache.js'

export interface CacheMiddlewareOptions {
  ttl?: number // Time to live in seconds
  keyGenerator?: (req: Request) => string // Custom key generator
  condition?: (req: Request, res: Response) => boolean // Condition to enable caching
  varyByHeaders?: string[] // Headers to vary cache by
  tags?: string[] // Cache tags
}

/**
 * Response caching middleware
 * Caches GET request responses
 */
export const cacheMiddleware = (options: CacheMiddlewareOptions = {}) => {
  const {
    ttl = 300, // 5 minutes default
    keyGenerator,
    condition,
    varyByHeaders = ['authorization'],
    tags = [],
  } = options

  return async (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next()
    }

    // Check if caching should be disabled
    if (condition && !condition(req, res)) {
      return next()
    }

    // Check if cache-control header says no-cache
    if (req.headers['cache-control']?.includes('no-cache')) {
      return next()
    }

    try {
      const redis = getRedisClient()
      if (!redis) {
        // Redis not available, skip caching
        return next()
      }

      // Generate cache key
      const cacheKey = keyGenerator
        ? keyGenerator(req)
        : generateCacheKey(
            `${req.method}:${req.path}`,
            {
              query: req.query,
              params: req.params,
              headers: varyByHeaders.reduce((acc: any, header: string) => {
                const value = req.headers[header]
                if (value) acc[header] = value
                return acc
              }, {}),
            }
          )

      // Try to get from cache
      const cachedResponse = await redis.get(cacheKey)
      if (cachedResponse) {
        const parsed = JSON.parse(cachedResponse)
        res.setHeader('X-Cache', 'HIT')
        res.setHeader('X-Cache-Key', cacheKey)
        
        // Restore headers
        if (parsed.headers) {
          Object.keys(parsed.headers).forEach((key) => {
            res.setHeader(key, parsed.headers[key])
          })
        }

        return res.status(parsed.status).json(parsed.body)
      }

      // Store original json method
      const originalJson = res.json.bind(res)
      res.setHeader('X-Cache', 'MISS')
      res.setHeader('X-Cache-Key', cacheKey)

      // Override json method to cache response
      res.json = function (body: any) {
        // Cache the response
        const responseData = {
          status: res.statusCode,
          body,
          headers: {
            'content-type': res.getHeader('content-type'),
          },
        }

        redis.setex(cacheKey, ttl, JSON.stringify(responseData))

        // Call original json method
        return originalJson(body)
      }

      next()
    } catch (error) {
      // If caching fails, continue without cache
      console.error('Cache middleware error:', error)
      next()
    }
  }
}

/**
 * Invalidate cache middleware
 * Call this before DELETE, PUT, PATCH operations
 */
export const invalidateCache = (pattern: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const redis = getRedisClient()
      if (!redis) {
        return next()
      }

      const patterns = Array.isArray(pattern) ? pattern : [pattern]
      
      for (const p of patterns) {
        // Replace :id with actual id from params
        const cachePattern = p.replace(':id', req.params.id || '*')
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
      console.error('Invalidate cache error:', error)
      next()
    }
  }
}

/**
 * ETag middleware for HTTP caching
 */
export const etagMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only for GET and HEAD requests
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next()
    }

    const originalSend = res.send.bind(res)
    const originalJson = res.json.bind(res)

    // Override send to add ETag
    res.send = function (body: any) {
      if (res.statusCode === 200) {
        const etag = generateETag(body)
        res.setHeader('ETag', etag)

        // Check if client has cached version
        const ifNoneMatch = req.headers['if-none-match']
        if (ifNoneMatch === etag) {
          return res.status(304).end()
        }
      }

      return originalSend(body)
    }

    // Override json to add ETag
    res.json = function (body: any) {
      if (res.statusCode === 200) {
        const etag = generateETag(JSON.stringify(body))
        res.setHeader('ETag', etag)

        // Check if client has cached version
        const ifNoneMatch = req.headers['if-none-match']
        if (ifNoneMatch === etag) {
          return res.status(304).end()
        }
      }

      return originalJson(body)
    }

    next()
  }
}

/**
 * Generate ETag from content
 */
const generateETag = (content: string | Buffer): string => {
  const hash = crypto.createHash('md5').update(content).digest('hex')
  return `"${hash}"`
}
