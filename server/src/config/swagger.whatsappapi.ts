import swaggerJsdoc from 'swagger-jsdoc'
import { config } from './env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'WhatsAppAPI API Documentation',
      version: '1.0.0',
      description: 'API documentation for WhatsAppAPI product. All endpoints are prefixed with /api/v1/whatsappapi',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:5005/api/v1/whatsappapi`,
        description: 'WhatsAppAPI Development server (Port 5005)',
      },
      {
        url: `https://api.whatsappapi.60yard.com/api/v1/whatsappapi`,
        description: 'WhatsAppAPI Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/v1/whatsappapi/auth/login endpoint',
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
      { name: 'WhatsAppAPI - Auth', description: 'WhatsAppAPI authentication endpoints' },
      { name: 'WhatsAppAPI - Users', description: 'WhatsAppAPI user management' },
      { name: 'WhatsAppAPI - Admin', description: 'WhatsAppAPI admin operations' },
      { name: 'WhatsAppAPI - Messages', description: 'WhatsAppAPI message management' },
      { name: 'WhatsAppAPI - Agents', description: 'WhatsAppAPI agent management' },
      { name: 'WhatsAppAPI - Properties', description: 'WhatsAppAPI property management' },
      { name: 'WhatsAppAPI - Support', description: 'WhatsAppAPI support tickets' },
      { name: 'WhatsAppAPI - Payments', description: 'WhatsAppAPI payment operations' },
      { name: 'WhatsAppAPI - Auctions', description: 'WhatsAppAPI auction requests' },
    ],
  },
  apis: [
    './src/products/whatsappapi/**/*.ts',
    './dist/products/whatsappapi/**/*.js',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
