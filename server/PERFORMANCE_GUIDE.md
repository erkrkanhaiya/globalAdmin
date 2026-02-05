# Performance Optimization Guide

This document describes all performance optimizations implemented in the server.

## 🚀 Features Implemented

### 1. Redis Caching

Redis is used for:
- Response caching
- Query result caching
- Cache invalidation strategies

**Location**: `src/utils/cache.ts`

**Usage Example**:
```typescript
import { withCache, generateCacheKey } from '../utils/cache.js'

// Cache expensive operation
const result = await withCache(
  generateCacheKey('users', userId),
  async () => {
    return await User.findById(userId)
  },
  { ttl: 3600 } // 1 hour
)
```

### 2. Response Caching Middleware

Automatically caches GET request responses.

**Features**:
- Configurable TTL (Time To Live)
- Custom key generation
- Conditional caching
- Header-based cache variation
- Cache tags for invalidation

**Usage**:
```typescript
import { cacheMiddleware } from '../middleware/cache.js'

// Apply to specific routes
router.get('/users', cacheMiddleware({ ttl: 300 }), getAllUsers)
```

### 3. Query Result Caching

Cache expensive database queries.

**Usage**:
```typescript
import { queryCacheMiddleware } from '../middleware/queryCache.js'

router.get(
  '/expensive-query',
  queryCacheMiddleware({
    prefix: 'expensive-query',
    ttl: 3600,
  }),
  expensiveController
)
```

### 4. HTTP ETag Support

Automatic ETag generation for HTTP caching (304 Not Modified).

**Benefits**:
- Reduced bandwidth usage
- Faster response times for cached content
- Better browser caching

### 5. Database Connection Pooling

Optimized MongoDB connection settings:

- **maxPoolSize**: 10 connections
- **minPoolSize**: 5 connections
- **maxIdleTimeMS**: 30 seconds
- **serverSelectionTimeoutMS**: 5 seconds
- **socketTimeoutMS**: 45 seconds

**Location**: `src/config/database.ts`

### 6. Response Compression

Gzip compression for all responses:
- Level 6 (balanced)
- Threshold: 1KB
- Automatic client detection

### 7. Performance Monitoring

Track and log:
- Response times
- Memory usage
- Slow requests (>1 second)
- Slow queries (>500ms)

**Headers Added**:
- `X-Response-Time`: Response time in milliseconds
- `X-Memory-Usage`: Heap memory usage
- `X-Cache`: Cache hit/miss status
- `X-Cache-Key`: Cache key used

## 📊 Performance Metrics

### Health Check Endpoint

GET `/health` now includes:

```json
{
  "status": "success",
  "services": {
    "database": "connected",
    "redis": "connected"
  },
  "performance": {
    "uptime": 3600,
    "memory": {
      "heapUsed": "50MB",
      "heapTotal": "100MB",
      "rss": "150MB"
    },
    "nodeVersion": "v20.x.x"
  }
}
```

## 🔧 Cache Invalidation

### Invalidate by Pattern

```typescript
import { invalidateCachePattern } from '../utils/cache.js'

// Invalidate all user caches
await invalidateCachePattern('cache:users:*')
```

### Invalidate by Tags

```typescript
import { invalidateCacheByTags } from '../utils/cache.js'

// Invalidate all caches with specific tags
await invalidateCacheByTags(['user:123', 'profile'])
```

### Automatic Invalidation

Use the invalidate cache middleware:

```typescript
import { invalidateCache } from '../middleware/cache.js'

router.put(
  '/users/:id',
  invalidateCache('GET:/api/v1/users/:id'),
  updateUser
)
```

## 📈 Best Practices

### 1. Cache Strategy

- **Short TTL (5-15 min)**: Frequently changing data
- **Medium TTL (1-6 hours)**: Moderately changing data
- **Long TTL (24+ hours)**: Rarely changing data

### 2. Cache Keys

Use descriptive, consistent cache keys:
```typescript
generateCacheKey('users', userId)
generateCacheKey('properties', { page, limit, filters })
```

### 3. Cache Invalidation

Always invalidate relevant caches after mutations:
- Update → Invalidate related GET endpoints
- Delete → Invalidate all related caches
- Create → Invalidate list endpoints

### 4. Monitor Performance

- Check `X-Response-Time` headers
- Monitor slow request logs
- Review Redis cache hit rates
- Track memory usage trends

## 🛠️ Configuration

### Redis Configuration

Set in `.env`:
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Cache TTL Configuration

Default TTLs:
- Response cache: 5 minutes (300 seconds)
- Query cache: 1 hour (3600 seconds)
- Custom: Configurable per endpoint

## 🚨 Troubleshooting

### Redis Not Available

If Redis is not running, the server will:
- Continue running normally
- Skip caching (no errors)
- Log warning message
- Cache headers will show `X-Cache: MISS`

### High Memory Usage

If memory usage is high:
1. Reduce cache TTL
2. Implement cache size limits
3. Add cache eviction policies
4. Monitor Redis memory

### Slow Responses

Check:
1. Database query performance
2. Cache hit rates
3. Network latency
4. Response size (compression)

## 📝 Example: Caching a Controller

```typescript
import { queryCacheMiddleware, invalidateQueryCache } from '../middleware/queryCache.js'

// GET endpoint with caching
router.get(
  '/users',
  queryCacheMiddleware({
    prefix: 'users-list',
    ttl: 600, // 10 minutes
  }),
  getAllUsers
)

// POST endpoint with cache invalidation
router.post(
  '/users',
  invalidateQueryCache(['users-list']),
  createUser
)
```

## 🎯 Performance Goals

Target metrics:
- Response time: < 200ms (cached), < 1s (uncached)
- Cache hit rate: > 70%
- Memory usage: < 512MB
- Database queries: < 100ms

## 📚 Additional Resources

- [Redis Documentation](https://redis.io/docs/)
- [Express Compression](https://github.com/expressjs/compression)
- [MongoDB Connection Pooling](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/)

