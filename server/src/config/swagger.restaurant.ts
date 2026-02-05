import swaggerJsdoc from 'swagger-jsdoc'
import { config } from './env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant API Documentation',
      version: '1.0.0',
      description: 'API documentation for Restaurant product. All endpoints are prefixed with /api/v1/restaurant',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:5002/api/v1/restaurant`,
        description: 'Restaurant Development server (Port 5002)',
      },
      {
        url: `https://api.restaurant.60yard.com/api/v1/restaurant`,
        description: 'Restaurant Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/v1/restaurant/auth/login endpoint',
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'HTTP Basic Authentication required for public endpoints. Use API_KEY:API_SECRET as username:password.',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      { name: 'Restaurant - Auth', description: 'Restaurant authentication endpoints' },
      { name: 'Restaurant - Users', description: 'Restaurant user management' },
      { name: 'Restaurant - Admin', description: 'Restaurant admin operations' },
      { name: 'Restaurant - Orders', description: 'Restaurant order management' },
      { name: 'Restaurant - Agents', description: 'Restaurant agent management' },
      { name: 'Restaurant - Properties', description: 'Restaurant property management' },
      { name: 'Restaurant - Support', description: 'Restaurant support tickets' },
      { name: 'Restaurant - Payments', description: 'Restaurant payment operations' },
      { name: 'Restaurant - Auctions', description: 'Restaurant auction requests' },
    ],
  },
  apis: [
    './src/products/restaurant/**/*.ts',
    './dist/products/restaurant/**/*.js',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
