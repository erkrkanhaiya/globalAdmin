import swaggerJsdoc from 'swagger-jsdoc'
import { config } from './env.js'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'RentalCabBooking API Documentation',
      version: '1.0.0',
      description: 'API documentation for RentalCabBooking product. All endpoints are prefixed with /api/v1/rentalcabbooking',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:5004/api/v1/rentalcabbooking`,
        description: 'RentalCabBooking Development server (Port 5004)',
      },
      {
        url: `https://api.rentalcabbooking.60yard.com/api/v1/rentalcabbooking`,
        description: 'RentalCabBooking Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/v1/rentalcabbooking/auth/login endpoint',
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
      { name: 'RentalCabBooking - Auth', description: 'RentalCabBooking authentication endpoints' },
      { name: 'RentalCabBooking - Users', description: 'RentalCabBooking user management' },
      { name: 'RentalCabBooking - Admin', description: 'RentalCabBooking admin operations' },
      { name: 'RentalCabBooking - Bookings', description: 'RentalCabBooking booking management' },
      { name: 'RentalCabBooking - Agents', description: 'RentalCabBooking agent management' },
      { name: 'RentalCabBooking - Properties', description: 'RentalCabBooking property management' },
      { name: 'RentalCabBooking - Support', description: 'RentalCabBooking support tickets' },
      { name: 'RentalCabBooking - Payments', description: 'RentalCabBooking payment operations' },
      { name: 'RentalCabBooking - Auctions', description: 'RentalCabBooking auction requests' },
    ],
  },
  apis: [
    './src/products/rentalcabbooking/**/*.ts',
    './dist/products/rentalcabbooking/**/*.js',
  ],
}

export const swaggerSpec = swaggerJsdoc(options)
