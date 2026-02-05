import swaggerJsdoc from 'swagger-jsdoc'
import { config } from './env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRM API Documentation',
      version: '1.0.0',
      description: 'API documentation for CRM product. All endpoints are prefixed with /api/v1/crm',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:5006/api/v1/crm`,
        description: 'CRM Development server (Port 5006)',
      },
      {
        url: `https://api.crm.60yard.com/api/v1/crm`,
        description: 'CRM Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/v1/crm/auth/login endpoint',
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
      { name: 'CRM - Auth', description: 'CRM authentication endpoints' },
      { name: 'CRM - Users', description: 'CRM user management' },
      { name: 'CRM - Admin', description: 'CRM admin operations' },
      { name: 'CRM - Contacts', description: 'CRM contact management' },
      { name: 'CRM - Leads', description: 'CRM lead management' },
      { name: 'CRM - Agents', description: 'CRM agent management' },
      { name: 'CRM - Properties', description: 'CRM property management' },
      { name: 'CRM - Support', description: 'CRM support tickets' },
      { name: 'CRM - Payments', description: 'CRM payment operations' },
      { name: 'CRM - Auctions', description: 'CRM auction requests' },
    ],
  },
  apis: [
    './src/products/crm/**/*.ts',
    './dist/products/crm/**/*.js',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
