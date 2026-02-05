import swaggerJsdoc from 'swagger-jsdoc'
import { config } from './env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LiveNotes API Documentation',
      version: '1.0.0',
      description: 'API documentation for LiveNotes product. All endpoints are prefixed with /api/v1/livenotes',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:5003/api/v1/livenotes`,
        description: 'LiveNotes Development server (Port 5003)',
      },
      {
        url: `https://api.livenotes.60yard.com/api/v1/livenotes`,
        description: 'LiveNotes Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/v1/livenotes/auth/login endpoint',
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
      { name: 'LiveNotes - Auth', description: 'LiveNotes authentication endpoints' },
      { name: 'LiveNotes - Users', description: 'LiveNotes user management' },
      { name: 'LiveNotes - Admin', description: 'LiveNotes admin operations' },
      { name: 'LiveNotes - Notes', description: 'LiveNotes note management' },
      { name: 'LiveNotes - Agents', description: 'LiveNotes agent management' },
      { name: 'LiveNotes - Properties', description: 'LiveNotes property management' },
      { name: 'LiveNotes - Support', description: 'LiveNotes support tickets' },
      { name: 'LiveNotes - Payments', description: 'LiveNotes payment operations' },
      { name: 'LiveNotes - Auctions', description: 'LiveNotes auction requests' },
    ],
  },
  apis: [
    './src/products/livenotes/**/*.ts',
    './dist/products/livenotes/**/*.js',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
