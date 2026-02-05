/**
 * Standalone Server for Whatsappapi Product
 * This allows the whatsappapi product to run independently on its own host/port
 * 
 * Usage:
 *   - Set PRODUCT_NAME=whatsappapi in .env
 *   - Set PORT=5005 (or any port)
 *   - Run: npm run start:whatsappapi
 */

import express, { Express, Request, Response, NextFunction, Router } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import { config } from '../../config/env.js'
import { connectDatabase } from '../../config/database.js'
import { getProductConnection } from '../../config/multiDatabase.js'
import { Product } from '../../modules/product/models/Product.js'
import { errorHandler } from "../../../../middleware/errorHandler.js'
import swaggerUi from 'swagger-ui-express'
import { requestLogger } from "../../../../middleware/requestLogger.js'
import { swaggerSpec } from '../../config/swagger.whatsappapi.js'
import whatsappapiRoutes from './routes/index.js'

const PRODUCT_SLUG = 'whatsappapi'
const DEFAULT_PORT = 5005

const app: Express = express()

app.use(helmet())
app.use(cors({
  origin: config.CORS_ORIGIN || '*',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(compression())

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

if (config.NODE_ENV === 'development') {
  app.use(morgan('dev'))
} else {
  app.use(morgan('combined'))
}

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

app.get('/health', async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Whatsappapi API Server is running',
    product: PRODUCT_SLUG,
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    port: process.env.PORT || DEFAULT_PORT,
  })
})

app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findOne({ slug: PRODUCT_SLUG, isActive: true })
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: `Product '${PRODUCT_SLUG}' not found or inactive`,
      })
    }
    const productConnection = await getProductConnection(product.slug, product.databaseName)
    ;(req as any).product = product
    ;(req as any).productConnection = productConnection
    next()
  } catch (error) {
    next(error)
  }
})

app.use('/api/v1', whatsappapiRoutes)

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'Whatsappapi API Server',
    product: PRODUCT_SLUG,
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api/v1',
    },
  })
})

app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.url,
  })
})

app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDatabase()
    const port = process.env.PORT || DEFAULT_PORT
    const server = app.listen(port, () => {
      console.log(`🚀 Whatsappapi API Server running on port ${port}`)
      console.log(`📍 Environment: ${config.NODE_ENV}`)
      console.log(`🌐 Health check: http://localhost:${port}/health`)
      console.log(`📡 API: http://localhost:${port}/api/v1`)
    })

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

if (import.meta.url === `file://${process.argv[1]}`) {
  startServer()
}

export default app
