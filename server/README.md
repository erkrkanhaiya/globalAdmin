# Admin Panel API Server

Monolithic backend API server for the Admin Panel application built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 Authentication & Authorization (JWT with role-based access)
- 👥 User Management (Admin, Subadmin, Agent, Doctor, Customer roles)
- 🏢 Agent Management
- 🏠 Property Management
- 💰 Payment Processing
- 🔨 Auction Request Management
- 📊 MongoDB with Mongoose ODM
- 🛡️ Security (Helmet, CORS, HPP, Rate Limiting)
- ✅ Input Validation
- 🎯 Error Handling
- 📝 Request Logging (Pino)
- 📚 Swagger API Documentation
- 🔌 Socket.IO for real-time features
- 🚀 Job Queues (Bull with Redis)

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── database.ts   # MongoDB connection
│   │   ├── env.ts        # Environment variables
│   │   ├── logger.ts     # Pino logger
│   │   ├── redis.ts      # Redis connection
│   │   ├── rateLimit.ts  # Rate limiting
│   │   ├── swagger.ts    # Swagger config
│   │   └── upload.ts     # File upload config
│   ├── controllers/      # Route controllers
│   │   ├── authController.ts
│   │   ├── adminController.ts
│   │   ├── mobileController.ts
│   │   ├── agentController.ts
│   │   ├── propertyController.ts
│   │   ├── auctionController.ts
│   │   └── paymentController.ts
│   ├── middleware/       # Custom middleware
│   │   ├── auth.ts       # Authentication & Authorization
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── models/           # MongoDB models
│   │   ├── User.ts
│   │   ├── Agent.ts
│   │   ├── Property.ts
│   │   ├── AuctionRequest.ts
│   │   └── Payment.ts
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts
│   │   ├── adminRoutes.ts
│   │   ├── mobileRoutes.ts
│   │   ├── agentRoutes.ts
│   │   ├── propertyRoutes.ts
│   │   ├── auctionRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── helpers.ts
│   │   └── socketService.ts
│   └── index.ts          # Server entry point
├── .gitignore
├── env.example           # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp env.example .env
```

3. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/admin_panel
MONGODB_DB_NAME=admin_panel
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
API_PREFIX=/api/v1
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (Protected)

### Admin APIs (Admin/Super Admin only)
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/users/:id` - Get user by ID
- `POST /api/v1/admin/agents` - Create agent
- `POST /api/v1/admin/users/:id/convert-to-agent` - Convert customer to agent
- `POST /api/v1/admin/users/:id/verify` - Verify agent/doctor
- `PATCH /api/v1/admin/users/:id/role` - Update role (Super Admin only)
- `PATCH /api/v1/admin/users/:id/status` - Update user status

### Mobile APIs
- `POST /api/v1/mobile/auth/register` - Register customer
- `GET /api/v1/mobile/profile` - Get profile (Protected)
- `PATCH /api/v1/mobile/profile` - Update profile (Protected)
- `POST /api/v1/mobile/agents/request-verification` - Request agent verification
- `POST /api/v1/mobile/doctors/request-verification` - Request doctor verification
- `GET /api/v1/mobile/verification/status` - Get verification status

### Agents
- `GET /api/v1/agents` - Get all agents (Protected)
- `GET /api/v1/agents/:id` - Get single agent (Protected)
- `POST /api/v1/agents` - Create agent (Admin/Manager)
- `PUT /api/v1/agents/:id` - Update agent (Admin/Manager)
- `DELETE /api/v1/agents/:id` - Delete agent (Admin)

### Properties
- `GET /api/v1/properties` - Get all properties (Protected)
- `GET /api/v1/properties/:id` - Get single property (Protected)
- `POST /api/v1/properties` - Create property (Admin/Manager)
- `PUT /api/v1/properties/:id` - Update property (Admin/Manager)
- `DELETE /api/v1/properties/:id` - Delete property (Admin)

### Payments
- `GET /api/v1/payments` - Get all payments (Protected)
- `GET /api/v1/payments/:id` - Get payment (Protected)
- `POST /api/v1/payments` - Create payment (Protected)
- `PATCH /api/v1/payments/:id` - Update payment status (Protected)

### Auction Requests
- `GET /api/v1/auction-requests` - Get all requests (Admin)
- `GET /api/v1/auction-requests/:id` - Get single request (Admin)
- `POST /api/v1/auction-requests` - Submit request (Protected)
- `PUT /api/v1/auction-requests/:id/approve` - Approve request (Admin)
- `PUT /api/v1/auction-requests/:id/decline` - Decline request (Admin)

## User Roles

### Admin Roles
- `super_admin` - Full system access
- `admin` - Admin access
- `subadmin_support` - Support subadmin
- `subadmin_agent` - Agent management subadmin
- `subadmin_reseller` - Reseller management subadmin
- `subadmin_marketing` - Marketing subadmin

### User Roles
- `agent` - Real estate agent (requires verification)
- `doctor` - Doctor (requires verification)
- `customer` - Regular customer (from mobile/web)

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Swagger Documentation

Access Swagger UI at: `http://localhost:5000/api-docs`

All endpoints are documented with:
- Request/response schemas
- Authentication requirements
- Example requests
- Error responses

## Socket.IO

Real-time features available via Socket.IO:
- WebSocket endpoint: `/socket.io`
- Authentication via JWT token
- Room-based messaging (user rooms, admin rooms)
- Real-time notifications

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/admin_panel |
| MONGODB_DB_NAME | Database name | admin_panel |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRE | JWT expiration | 7d |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |
| API_PREFIX | API prefix | /api/v1 |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |

## MongoDB Setup

Make sure MongoDB is running on your system:

```bash
# Using Homebrew (macOS)
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

## Development

The server uses TypeScript and runs in watch mode during development. Changes are automatically reloaded.

## License

ISC
