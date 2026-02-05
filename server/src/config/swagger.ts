import swaggerJsdoc from 'swagger-jsdoc'
import { config } from './env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Admin Panel API',
      version: '1.0.0',
      description: 'API documentation for Admin Panel application with Admin and User endpoints',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server',
      },
      {
        url: `https://api.60yard.com`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from login endpoint (for authenticated endpoints)',
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'HTTP Basic Authentication required for all public endpoints (registration, login). Use API_KEY:API_SECRET as username:password. Base64 encode the credentials.',
        },
        swaggerBasicAuth: {
          type: 'http',
          scheme: 'basic',
          description: 'HTTP Basic Authentication for Swagger documentation. Username: admin, Password: I9dUyVAWjVVY6Cj4',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      // ==================== ADMIN APIs ====================
      { 
        name: 'Admin - Dashboard', 
        description: 'Admin dashboard and statistics (Admin/Super Admin only)'
      },
      { 
        name: 'Admin - Users', 
        description: 'User management endpoints (Admin/Super Admin only)'
      },
      { 
        name: 'Admin - Agents', 
        description: 'Agent management by admin (Admin/Super Admin only)'
      },
      { 
        name: 'Admin - Properties', 
        description: 'Property management by admin (Admin/Super Admin only)'
      },
      { 
        name: 'Admin - Payments', 
        description: 'Payment management by admin (Admin/Super Admin only)'
      },
      { 
        name: 'Admin - Auctions', 
        description: 'Auction request management by admin (Admin/Super Admin only)'
      },
      { 
        name: 'Admin - Support', 
        description: 'Support ticket management by admin (Admin/Super Admin only)'
      },
      // ==================== USER APIs ====================
      { 
        name: 'User - Auth', 
        description: 'User authentication and registration (Public/User)'
      },
      { 
        name: 'User - Profile', 
        description: 'User profile management (Authenticated users)'
      },
      { 
        name: 'User - Verification', 
        description: 'Agent and doctor verification requests (Authenticated users)'
      },
      { 
        name: 'User - Agents', 
        description: 'User browsing and viewing agents (Authenticated users)'
      },
      { 
        name: 'User - Properties', 
        description: 'User browsing and viewing properties (Authenticated users)'
      },
      { 
        name: 'User - Auctions', 
        description: 'User auction requests and viewing (Authenticated users)'
      },
      { 
        name: 'User - Payments', 
        description: 'User payment operations (Authenticated users)'
      },
      { 
        name: 'User - Support', 
        description: 'User support ticket creation and management (Authenticated users)'
      },
      // ==================== PUBLIC APIs ====================
      { 
        name: 'Auth', 
        description: 'General authentication endpoints (Public)'
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/modules/**/routes/*.ts',
    './src/modules/**/controllers/*.ts',
    './dist/routes/*.js',
    './dist/modules/**/routes/*.js',
    './dist/modules/**/controllers/*.js',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)

