import { getRedisClient } from '../config/redis.js'
import crypto from 'crypto'

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  key?: string // Custom cache key
  tags?: string[] // Cache tags for invalidation
}

/**
 * Generate cache key from request
 */
export const generateCacheKey = (prefix: string, identifier: string | object): string => {
  if (typeof identifier === 'object') {
    const hash = crypto.createHash('md5').update(JSON.stringify(identifier)).digest('hex')
    return `cache:${prefix}:${hash}`
  }
  return `cache:${prefix}:${identifier}`
}

/**
 * Get value from cache
 */
export const getFromCache = async <T>(key: string): Promise<T | null> => {
  try {
    const redis = getRedisClient()
    if (!redis) return null

    const data = await redis.get(key)
    if (!data) return null

    return JSON.parse(data) as T
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

/**
 * Set value in cache
 */
export const setInCache = async <T>(
  key: string,
  value: T,
  ttl: number = 3600
): Promise<boolean> => {
  try {
    const redis = getRedisClient()
    if (!redis) return false

    await redis.setex(key, ttl, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Cache set error:', error)
    return false
  }
}

/**
 * Delete from cache
 */
export const deleteFromCache = async (key: string): Promise<boolean> => {
  try {
    const redis = getRedisClient()
    if (!redis) return false

    await redis.del(key)
    return true
  } catch (error) {
    console.error('Cache delete error:', error)
    return false
  }
}

/**
 * Delete multiple keys from cache
 */
export const deleteMultipleFromCache = async (keys: string[]): Promise<number> => {
  try {
    const redis = getRedisClient()
    if (!redis) return 0

    if (keys.length === 0) return 0
    return await redis.del(...keys)
  } catch (error) {
    console.error('Cache delete multiple error:', error)
    return 0
  }
}

/**
 * Invalidate cache by pattern
 */
export const invalidateCachePattern = async (pattern: string): Promise<number> => {
  try {
    const redis = getRedisClient()
    if (!redis) return 0

    const keys: string[] = []
    let cursor = '0'

    do {
      const result = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
      cursor = result[0]
      keys.push(...result[1])
    } while (cursor !== '0')

    if (keys.length > 0) {
      return await redis.del(...keys)
    }

    return 0
  } catch (error) {
    console.error('Cache invalidate pattern error:', error)
    return 0
  }
}

/**
 * Invalidate cache by tags
 */
export const invalidateCacheByTags = async (tags: string[]): Promise<number> => {
  try {
    const redis = getRedisClient()
    if (!redis) return 0

    const keys: string[] = []
    for (const tag of tags) {
      const pattern = `cache:tag:${tag}:*`
      let cursor = '0'
      do {
        const result = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100)
        cursor = result[0]
        keys.push(...result[1])
      } while (cursor !== '0')
    }

    if (keys.length > 0) {
      return await redis.del(...keys)
    }

    return 0
  } catch (error) {
    console.error('Cache invalidate tags error:', error)
    return 0
  }
}

/**
 * Cache with tags
 */
export const setInCacheWithTags = async <T>(
  key: string,
  value: T,
  tags: string[],
  ttl: number = 3600
): Promise<boolean> => {
  try {
    const redis = getRedisClient()
    if (!redis) return false

    // Set the main cache value
    await redis.setex(key, ttl, JSON.stringify(value))

    // Set tag references
    for (const tag of tags) {
      const tagKey = `cache:tag:${tag}:${key}`
      await redis.setex(tagKey, ttl, '1')
    }

    return true
  } catch (error) {
    console.error('Cache set with tags error:', error)
    return false
  }
}

/**
 * Clear all cache (use with caution)
 */
export const clearAllCache = async (): Promise<boolean> => {
  try {
    const redis = getRedisClient()
    if (!redis) return false

    await redis.flushdb()
    return true
  } catch (error) {
    console.error('Cache clear all error:', error)
    return false
  }
}

/**
 * Cache wrapper for async functions
 */
export const withCache = async <T>(
  key: string,
  fn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> => {
  const { ttl = 3600 } = options

  // Try to get from cache first
  const cached = await getFromCache<T>(key)
  if (cached !== null) {
    return cached
  }

  // Execute function and cache result
  const result = await fn()
  await setInCache(key, result, ttl)

  return result
}
