import { Request, Response } from 'express'

/**
 * Performance monitoring utilities
 */

export interface PerformanceMetrics {
  responseTime: number
  memoryUsage: NodeJS.MemoryUsage
  timestamp: number
}

/**
 * Track response time
 */
export const trackResponseTime = (req: Request, res: Response): void => {
  const startTime = Date.now()

  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    const memoryUsage = process.memoryUsage()

    // Log slow requests (> 1 second)
    if (responseTime > 1000) {
      console.warn('⚠️  Slow request detected:', {
        method: req.method,
        path: req.path,
        responseTime: `${responseTime}ms`,
        memoryUsage: {
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        },
      })
    }

    // Add performance headers
    res.setHeader('X-Response-Time', `${responseTime}ms`)
    res.setHeader('X-Memory-Usage', `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`)
  })
}

/**
 * Get memory usage info
 */
export const getMemoryUsage = (): NodeJS.MemoryUsage => {
  return process.memoryUsage()
}

/**
 * Format memory usage for logging
 */
export const formatMemoryUsage = (memory: NodeJS.MemoryUsage): string => {
  return {
    rss: `${Math.round(memory.rss / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memory.heapTotal / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memory.heapUsed / 1024 / 1024)}MB`,
    external: `${Math.round(memory.external / 1024 / 1024)}MB`,
  } as any
}

/**
 * Database query performance helper
 */
export class QueryPerformance {
  private static queries: Map<string, number[]> = new Map()

  static start(queryName: string): () => void {
    const startTime = Date.now()
    return () => {
      const duration = Date.now() - startTime
      if (!this.queries.has(queryName)) {
        this.queries.set(queryName, [])
      }
      const times = this.queries.get(queryName)!
      times.push(duration)

      // Keep only last 100 measurements
      if (times.length > 100) {
        times.shift()
      }

      // Log slow queries (> 500ms)
      if (duration > 500) {
        console.warn(`⚠️  Slow query: ${queryName} took ${duration}ms`)
      }
    }
  }

  static getStats(queryName: string): {
    count: number
    avg: number
    min: number
    max: number
  } | null {
    const times = this.queries.get(queryName)
    if (!times || times.length === 0) return null

    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const min = Math.min(...times)
    const max = Math.max(...times)

    return { count: times.length, avg, min, max }
  }

  static getAllStats(): Record<string, any> {
    const stats: Record<string, any> = {}
    for (const [queryName] of this.queries) {
      stats[queryName] = this.getStats(queryName)
    }
    return stats
  }
}
