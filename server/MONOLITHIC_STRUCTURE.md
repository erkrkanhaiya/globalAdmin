# Monolithic Architecture Structure

The project has been consolidated into a single monolithic server structure.

## 📁 Project Structure

```
server/
├── src/
│   ├── config/              # All configuration
│   │   ├── database.ts       # MongoDB connection
│   │   ├── env.ts            # Environment variables
│   │   ├── logger.ts         # Pino logger
│   │   ├── redis.ts          # Redis connection
│   │   ├── rateLimit.ts      # Rate limiting
│   │   ├── swagger.ts        # Swagger/OpenAPI config
│   │   ├── upload.ts         # File upload (Multer)
│   │   ├── cloudinary.ts     # Cloudinary config
│   │   └── s3.ts             # AWS S3 config
│   │
│   ├── controllers/          # All business logic
│   │   ├── authController.ts      # Authentication
│   │   ├── adminController.ts    # Admin operations
│   │   ├── mobileController.ts    # Mobile app operations
│   │   ├── agentController.ts     # Agent management
│   │   ├── propertyController.ts  # Property management
│   │   ├── auctionController.ts   # Auction management
│   │   └── paymentController.ts   # Payment processing
│   │
│   ├── middleware/           # Middleware
│   │   ├── auth.ts           # JWT authentication & authorization
│   │   ├── errorHandler.ts   # Error handling
│   │   └── validator.ts      # Input validation
│   │
│   ├── models/               # MongoDB models
│   │   ├── User.ts           # User with all roles
│   │   ├── Agent.ts          # Agent model
│   │   ├── Property.ts       # Property model
│   │   ├── AuctionRequest.ts # Auction model
│   │   └── Payment.ts        # Payment model
│   │
│   ├── routes/               # API routes
│   │   ├── authRoutes.ts     # /api/v1/auth
│   │   ├── adminRoutes.ts    # /api/v1/admin
│   │   ├── mobileRoutes.ts   # /api/v1/mobile
│   │   ├── agentRoutes.ts   # /api/v1/agents
│   │   ├── propertyRoutes.ts # /api/v1/properties
│   │   ├── auctionRoutes.ts  # /api/v1/auction-requests
│   │   ├── paymentRoutes.ts   # /api/v1/payments
│   │   └── index.ts          # Route aggregator
│   │
│   ├── utils/                # Utilities
│   │   ├── helpers.ts         # Helper functions
│   │   └── socketService.ts   # Socket.IO utilities
│   │
│   └── index.ts              # Server entry point
│
├── package.json
├── tsconfig.json
├── env.example
└── README.md
```

## 🚀 All Features in One Server

- ✅ Authentication & Authorization
- ✅ Admin APIs (separate from mobile)
- ✅ Mobile APIs (separate from admin)
- ✅ User Role Management
- ✅ Agent Management
- ✅ Property Management
- ✅ Payment Processing
- ✅ Auction Management
- ✅ Socket.IO for real-time features
- ✅ Swagger API Documentation
- ✅ File Upload Support
- ✅ Job Queues (Bull)

## 📡 API Routes Summary

All routes are under `/api/v1/`:

- `/auth` - Standard authentication
- `/admin` - Admin operations (Admin/Super Admin only)
- `/mobile` - Mobile app operations
- `/agents` - Agent management
- `/properties` - Property management
- `/auction-requests` - Auction management
- `/payments` - Payment management

## 🎯 Benefits of Monolithic Architecture

1. **Simpler Development** - All code in one place
2. **Easier Debugging** - Single codebase to trace
3. **Simpler Deployment** - One server to deploy
4. **Shared Code** - Models and utilities easily accessible
5. **Faster Development** - No service communication overhead

## 📝 Next Steps

1. Install dependencies: `cd server && npm install`
2. Set up environment: `cp env.example .env`
3. Start server: `npm run dev`
4. Access Swagger: `http://localhost:5000/api-docs`

All microservices functionality is now consolidated in the monolithic server!

