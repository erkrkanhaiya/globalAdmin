/**
 * Standalone Server for Restaurant Product
 * This allows the restaurant product to run independently on its own host/port
 * 
 * Usage:
 *   - Set PRODUCT_NAME=restaurant in .env
 *   - Set PORT=5002 (or any port)
 *   - Run: npm run start:restaurant
 *   - Or: node dist/products/restaurant/server.js
 */

import express, { Express, Request, Response, NextFunction, Router } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import { config } from '../../config/env.js'
import { connectDatabase } from '../../config/database.js'
import { getProductConnection } from '../../config/multiDatabase.js'
import { Product } from '../../modules/product/models/Product.js'
import { errorHandler } from "../../../../middleware/errorHandler.js'
import { requestLogger } from "../../../../middleware/requestLogger.js'
import { swaggerSpec } from '../../config/swagger.restaurant.js'
import restaurantRoutes from './routes/index.js'

const PRODUCT_SLUG = 'restaurant'
const DEFAULT_PORT = 5002

// Create Express app
const app: Express = express()

// Security middleware
app.use(helmet())
app.use(cors({
  origin: config.CORS_ORIGIN || '*',
  credentials: true,
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression
app.use(compression())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Logging
if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

// Request logger middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()
  
  res.on('finish', () => {
    const responseTime = Date.now() - start
    requestLogger({
      method: req.method,
      url: req.url,
      ip: req.ip,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    })
  })
  
  next()
})

// Health check
app.get('/health', async (req, res) => {
  let environment = config.NODE_ENV
  const hostname = req.get('host') || req.hostname || ''
  
  res.status(200).json({
    status: 'success',
    message: 'Restaurant API Server is running',
    product: PRODUCT_SLUG,
    timestamp: new Date().toISOString(),
    environment,
    hostname,
    port: process.env.PORT || DEFAULT_PORT,
  })
})

// Product middleware - sets up product context
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Find product in main database
    const product = await Product.findOne({ slug: PRODUCT_SLUG, isActive: true })

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: `Product '${PRODUCT_SLUG}' not found or inactive`,
      })
    }

    // Get or create connection to product's database
    const productConnection = await getProductConnection(product.slug, product.databaseName)

    // Attach product and connection to request
    ;(req as any).product = product
    ;(req as any).productConnection = productConnection

    next()
  } catch (error) {
    next(error)
  }
})

// Swagger API Documentation
if (config.SWAGGER_ENABLED) {
  const swaggerPath = '/api-docs'
  
  const swaggerBasicAuth = (req: Request, res: Response, next: NextFunction) => {
    const staticAssetPatterns = ['/swagger-ui', '/favicon', '.css', '.js', '.png', '.jpg', '.gif', '.svg', '.woff', '.woff2', '.ttf']
    if (staticAssetPatterns.some(pattern => req.path.includes(pattern))) {
      return next()
    }
    
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Restaurant API Documentation"')
      return res.status(401).send('Authentication required')
    }
    
    try {
      const base64Credentials = authHeader.split(' ')[1]
      const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
      const [username, password] = credentials.split(':')
      
      if (username === config.SWAGGER_USERNAME && password === config.SWAGGER_PASSWORD) {
        return next()
      }
      
      res.setHeader('WWW-Authenticate', 'Basic realm="Restaurant API Documentation"')
      return res.status(401).send('Invalid credentials')
    } catch (error) {
      res.setHeader('WWW-Authenticate', 'Basic realm="Restaurant API Documentation"')
      return res.status(401).send('Authentication failed')
    }
  }
  
  const swaggerRouter = Router()
  swaggerRouter.use(swaggerBasicAuth)
  swaggerRouter.use(swaggerUi.serve)
  swaggerRouter.get('/', swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Restaurant API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  }))
  swaggerRouter.get('/.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
  
  app.use(swaggerPath, swaggerRouter)
  console.log(`📚 Restaurant Swagger docs available at http://localhost:${process.env.PORT || DEFAULT_PORT}${swaggerPath}`)
}

// API Routes - Product-specific routes
app.use('/api/v1', restaurantRoutes)

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Restaurant API Server',
    product: PRODUCT_SLUG,
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
    },
  })
})

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.url,
  })
})

// Error handler (must be last)
app.use(errorHandler)

// Start server
const startServer = async () => {
  try {
    // Connect to main database (for product lookup)
    await connectDatabase()

    const port = process.env.PORT || DEFAULT_PORT
    const server = app.listen(port, () => {
      console.log(`🚀 Restaurant API Server running on port ${port}`)
      console.log(`📍 Environment: ${config.NODE_ENV}`)
      console.log(`🌐 Health check: http://localhost:${port}/health`)
      console.log(`📡 API: http://localhost:${port}/api/v1`)
    })

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...')
      server.close(() => {
        console.log('Process terminated')
        process.exit(0)
      })
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Start if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer()
}

export default app
