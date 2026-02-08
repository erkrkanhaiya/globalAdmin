import express, { Express, Router, Request, Response, NextFunction } from 'express'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import cors from 'cors'
import helmet from 'helmet'
import hpp from 'hpp'
import compression from 'compression'
import responseTime from 'response-time'
import swaggerUi from 'swagger-ui-express'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'
import { ExpressAdapter } from '@bull-board/express'
import jwt from 'jsonwebtoken'
import { config } from '@/config/env.js'
import { connectDatabase } from '@/config/database.js'
import { createRedisClient, getRedisClient } from '@/config/redis.js'
import { logger } from '@/config/logger.js'
import { apiLimiter, authLimiter } from '@/config/rateLimit.js'
import { swaggerSpec } from '@/config/swagger.js'
import routes from '@/routes/index.js'
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler.js'
import { setSocketIO } from '@/utils/socketService.js'
import { protect, authorize } from '@/middleware/auth.js'
import { cacheMiddleware, etagMiddleware } from '@/middleware/cache.js'
import cookieParser from 'cookie-parser'

const app: Express = express()
const httpServer = createServer(app)

// Socket.IO setup
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: [
      config.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  path: '/socket.io',
})

setSocketIO(io)

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline scripts for Swagger login page
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}))
app.use(hpp()) // Prevent HTTP Parameter Pollution

// CORS configuration
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true)
    
    const allowedOrigins = [
      config.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000',
    ]
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}

app.use(cors(corsOptions))

// Cookie parser (needed for Swagger session management)
app.use(cookieParser())

// Body parser with error handling
app.use(express.json({ 
  limit: '10mb', 
  strict: false,
}))
app.use((err: any, req: any, res: any, next: any) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON format. Please check your request body.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      hint: 'Make sure: 1) Content-Type header is "application/json", 2) Request body is valid JSON, 3) All property names use double quotes',
    })
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON format. Please check your request body.',
      hint: 'Make sure the request body is valid JSON with Content-Type: application/json header',
    })
  }
  next(err)
})
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression (compress responses)
app.use(compression({
  level: 6, // Compression level (1-9, 6 is a good balance)
  threshold: 1024, // Only compress responses larger than 1KB
  filter: (req, res) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false
    }
    // Use default compression filter
    return compression.filter(req, res)
  },
}))

// ETag support for HTTP caching (before other middleware)
app.use(etagMiddleware())

// Response caching for GET requests (after compression, before routes)
app.use(
  config.API_PREFIX,
  cacheMiddleware({
    ttl: 300, // 5 minutes default
    condition: (req, res) => {
      // Don't cache authenticated user-specific endpoints
      if (req.path.includes('/profile') || req.path.includes('/me')) {
        return false
      }
      return true
    },
  })
)

// Response time tracking (sets X-Response-Time header automatically)
app.use(responseTime())

// Rate limiting
app.use(config.API_PREFIX, apiLimiter)

// Performance logging (only logs, doesn't set headers - responseTime() already does that)
app.use((req, res, next) => {
  const startTime = Date.now()
  
  // Log after response is sent
  res.on('finish', () => {
    const responseTime = Date.now() - startTime
    logger.info({
      method: req.method,
      url: req.url,
      ip: req.ip,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    })
  })
  
  next()
})

// Health check with performance metrics
app.get('/health', async (req, res) => {
  // Determine environment from config, with fallback check for production domain
  let environment = config.NODE_ENV
  
  // If environment is still development but we're on production domain, override it
  const hostname = req.get('host') || req.hostname || ''
  const isProductionDomain = hostname.includes('60yard.com') || hostname.includes('api.60yard.com')
  
  if (environment === 'development' && isProductionDomain) {
    environment = 'production'
  }

  // Check Redis connection
  let redisStatus = 'disconnected'
  try {
    const redis = getRedisClient()
    if (redis) {
      await redis.ping()
      redisStatus = 'connected'
    }
  } catch (error) {
    redisStatus = 'error'
  }

  // Get memory usage
  const memoryUsage = process.memoryUsage()
  
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment,
    services: {
      database: 'connected', // MongoDB connection is required, so if server is running, DB is connected
      redis: redisStatus,
    },
    performance: {
      uptime: process.uptime(),
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      },
      nodeVersion: process.version,
    },
  })
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  logger.info({ socketId: socket.id }, 'Client connected')

  socket.on('authenticate', (token: string) => {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET) as {
        id: string
        email: string
        role: string
      }

      ;(socket as any).userId = decoded.id
      ;(socket as any).userRole = decoded.role
      ;(socket as any).authenticated = true

      socket.emit('authenticated', { status: 'success', user: decoded })
      logger.info({ socketId: socket.id, userId: decoded.id }, 'Socket authenticated')
    } catch (error) {
      socket.emit('error', { message: 'Authentication failed' })
      socket.disconnect()
      logger.warn({ socketId: socket.id }, 'Socket authentication failed')
    }
  })

  socket.on('join-user-room', (userId: string) => {
    if ((socket as any).authenticated) {
      socket.join(`user:${userId}`)
      logger.info({ socketId: socket.id, userId }, 'User joined their room')
    }
  })

  socket.on('join-admin-room', () => {
    if ((socket as any).authenticated && (socket as any).userRole === 'admin') {
      socket.join('admin')
      logger.info({ socketId: socket.id }, 'Joined admin room')
    } else {
      socket.emit('error', { message: 'Unauthorized: Admin access required' })
    }
  })

  socket.on('disconnect', () => {
    logger.info({ socketId: socket.id }, 'Client disconnected')
  })

  socket.on('error', (error) => {
    logger.error({ socketId: socket.id, error }, 'Socket error')
  })
})

// Swagger API Documentation (Protected with Simple Basic Auth)
if (config.SWAGGER_ENABLED) {
  const swaggerPath = config.SWAGGER_PATH || '/api-docs'
  
  // Simple Basic Auth middleware for Swagger
  const swaggerBasicAuth = (req: Request, res: Response, next: NextFunction) => {
    // Skip auth check for Swagger UI static assets
    const staticAssetPatterns = ['/swagger-ui', '/favicon', '.css', '.js', '.png', '.jpg', '.gif', '.svg', '.woff', '.woff2', '.ttf']
    if (staticAssetPatterns.some(pattern => req.path.includes(pattern))) {
      return next()
    }
    
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Documentation"')
      return res.status(401).send('Authentication required')
    }
    
    try {
      const base64Credentials = authHeader.split(' ')[1]
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
      const [username, password] = credentials.split(':')
      
      const validUsername = config.SWAGGER_USERNAME
      const validPassword = config.SWAGGER_PASSWORD
      
      if (username === validUsername && password === validPassword) {
        return next()
      }
      
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Documentation"')
      return res.status(401).send('Invalid credentials')
    } catch (error) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Swagger API Documentation"')
      return res.status(401).send('Authentication failed')
    }
  }
  
  // Create router for Swagger with Basic Auth
  const swaggerRouter = Router()
  
  // Apply Basic Auth to all Swagger routes
  swaggerRouter.use(swaggerBasicAuth)
  
  // Serve Swagger UI static files
  swaggerRouter.use(swaggerUi.serve)
  
  // Setup Swagger UI page
  swaggerRouter.get('/', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: '60 Yard Admin API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }))
  
  // Protect Swagger JSON endpoint
  swaggerRouter.get('/.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  
  // Mount Swagger router
  app.use(swaggerPath, swaggerRouter)
  
  logger.info(`📚 Swagger docs available at http://localhost:${config.PORT}${swaggerPath} (Basic Auth: ${config.SWAGGER_USERNAME} / ${config.SWAGGER_PASSWORD})`)
}

// Bull Board (Queue Management)
if (config.NODE_ENV === 'development') {
  try {
    const serverAdapter = new ExpressAdapter()
    serverAdapter.setBasePath('/admin/queues')
    createBullBoard({
      queues: [], // Add your Bull queues here when you create them
      serverAdapter,
    })
    app.use('/admin/queues', serverAdapter.getRouter())
    logger.info(`🔧 Bull Board available at http://localhost:${config.PORT}/admin/queues`)
  } catch (error) {
    logger.warn('Bull Board not available (Redis may not be running)')
  }
}

// API Routes
app.use(config.API_PREFIX, routes)

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase()

    // Connect to Redis (optional, will fail gracefully if Redis is not available)
    try {
      const redis = createRedisClient()
      // Test Redis connection
      await redis.ping()
      logger.info('✅ Redis connected and ready for caching')
    } catch (error) {
      logger.warn('⚠️  Redis connection failed - caching disabled (optional service)')
    }

    // Create uploads directory if it doesn't exist
    import('fs').then((fs) => {
      const uploadPath = config.UPLOAD_PATH || './uploads'
      if (!fs.default.existsSync(uploadPath)) {
        fs.default.mkdirSync(uploadPath, { recursive: true })
        logger.info(`📁 Created uploads directory: ${uploadPath}`)
      }
    })

    // Start listening
    httpServer.listen(config.PORT, () => {
      console.log('\n' + '='.repeat(60))
      console.log('🚀 SERVER BACKEND STARTED SUCCESSFULLY')
      console.log('='.repeat(60))
      console.log(`📍 Server URL:    http://localhost:${config.PORT}`)
      console.log(`🔌 API Base URL:  http://localhost:${config.PORT}${config.API_PREFIX}`)
      console.log(`💚 Health Check:  http://localhost:${config.PORT}/health`)
      if (config.SWAGGER_ENABLED) {
        console.log(`📚 Swagger Docs:  http://localhost:${config.PORT}${config.SWAGGER_PATH}`)
      }
      console.log(`🌐 Environment:   ${config.NODE_ENV}`)
      console.log(`🔌 Socket.IO:     http://localhost:${config.PORT}/socket.io`)
      console.log('='.repeat(60) + '\n')
      
      logger.info({
        message: 'Server started with Socket.IO',
        port: config.PORT,
        environment: config.NODE_ENV,
        api: `http://localhost:${config.PORT}${config.API_PREFIX}`,
        socketPath: '/socket.io',
      })
    })
  } catch (error) {
    logger.error({ error, message: 'Failed to start server' })
    process.exit(1)
  }
}

startServer()

export default app

