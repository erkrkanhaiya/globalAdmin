# Microservices Architecture Setup

## ✅ Complete Microservices Structure Created

The project has been restructured into a microservices architecture with the following services:

### Services Created:

1. **Auth Service** (Port 5001)
   - User authentication & registration
   - JWT token management
   - User management

2. **Property Service** (Port 5002)
   - Property CRUD operations
   - Property search & filtering
   - Image handling

3. **Payment Service** (Port 5003)
   - Payment processing
   - Transaction management
   - Payment status tracking

4. **API Gateway** (Port 4000)
   - Request routing
   - Service aggregation
   - Authentication at gateway level

### Shared Components:

- **Common Package** (`services/shared/common/`)
  - Logger utilities
  - Error handling
  - Authentication middleware
  - Service client for inter-service communication
  - Environment configuration

## 🚀 Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 2: Local Development

```bash
# 1. Install dependencies for shared common first
cd services/shared/common
npm install
npm run build

# 2. Install dependencies for each service
cd ../auth-service && npm install
cd ../property-service && npm install  
cd ../payment-service && npm install
cd ../gateway && npm install

# 3. Start MongoDB and Redis
docker-compose up mongodb redis -d

# 4. Start each service in separate terminals
# Terminal 1
cd services/auth-service && npm run dev

# Terminal 2
cd services/property-service && npm run dev

# Terminal 3
cd services/payment-service && npm run dev

# Terminal 4
cd services/gateway && npm run dev
```

## 📡 Service Endpoints

### API Gateway (Main Entry Point)
- **URL:** `http://localhost:4000`
- All API requests go through the gateway

### Direct Service Access (for testing)
- **Auth Service:** `http://localhost:5001`
- **Property Service:** `http://localhost:5002`
- **Payment Service:** `http://localhost:5003`

## 🔧 Configuration

Each service has its own `.env` file. Create them from examples:

```bash
# Auth Service
cd services/auth-service
cp ../../server/env.example .env
# Edit .env with PORT=5001, etc.

# Property Service
cd services/property-service
cp ../../server/env.example .env
# Edit .env with PORT=5002, etc.

# Payment Service
cd services/payment-service
cp ../../server/env.example .env
# Edit .env with PORT=5003, etc.

# Gateway
cd services/gateway
cp ../../server/env.example .env
# Edit .env with PORT=4000, etc.
```

## 🧪 Testing

### Test Services Health

```bash
# Through Gateway
curl http://localhost:4000/health

# Direct service access
curl http://localhost:5001/health  # Auth
curl http://localhost:5002/health  # Property
curl http://localhost:5003/health  # Payment
```

### Test Authentication Flow

```bash
# Register user (through gateway)
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'

# Login (through gateway)
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Use token for authenticated requests
TOKEN="your-jwt-token-here"
curl http://localhost:4000/api/v1/properties \
  -H "Authorization: Bearer $TOKEN"
```

## 📁 Project Structure

```
services/
├── shared/
│   └── common/           # Shared utilities
│       ├── src/
│       │   ├── config/   # Environment config
│       │   ├── utils/    # Logger, errors, service client
│       │   └── middleware/ # Auth middleware
│       └── package.json
│
├── auth-service/         # Port 5001
│   ├── src/
│   │   ├── models/       # User model
│   │   ├── controllers/  # Auth controllers
│   │   ├── routes/       # Auth routes
│   │   └── config/       # Service config
│   └── package.json
│
├── property-service/     # Port 5002
│   ├── src/
│   │   ├── models/       # Property model
│   │   ├── controllers/  # Property controllers
│   │   └── routes/       # Property routes
│   └── package.json
│
├── payment-service/      # Port 5003
│   ├── src/
│   │   ├── models/       # Payment model
│   │   ├── controllers/  # Payment controllers
│   │   └── routes/       # Payment routes
│   └── package.json
│
└── gateway/              # Port 4000
    ├── src/
    │   └── index.ts      # Gateway routing
    └── package.json

docker-compose.yml         # Docker orchestration
```

## 🔄 Next Steps

1. **Add Agent Service** - Similar structure to property service
2. **Add Auction Service** - Similar structure to payment service
3. **Add Service Discovery** - For dynamic service registration
4. **Add Message Queue** - For async communication (Bull/Redis)
5. **Add Monitoring** - Prometheus metrics, logging aggregation
6. **Add API Documentation** - Swagger for each service

## 📚 Documentation

- See `services/MICROSERVICES.md` for detailed architecture documentation
- Each service follows the same structure for consistency
- Shared common package reduces code duplication

## ⚠️ Important Notes

1. **Workspace Setup**: The root `package.json` uses npm workspaces. You may need to use `npm install` at the root level.

2. **TypeScript Paths**: Each service uses path aliases to reference `@admin/common`. Make sure to build the common package first.

3. **Database Strategy**: Each service uses separate MongoDB databases for isolation. You can change this to shared database if preferred.

4. **Service Communication**: Services communicate via HTTP REST. For production, consider adding message queues for async operations.

5. **Authentication**: JWT tokens are validated at the gateway and forwarded to services. Each service can also validate tokens independently.

## 🐛 Troubleshooting

**Issue:** Services can't find `@admin/common`
- **Solution:** Build the common package first: `cd services/shared/common && npm install && npm run build`

**Issue:** Port already in use
- **Solution:** Change PORT in service `.env` file or stop conflicting services

**Issue:** MongoDB connection fails
- **Solution:** Ensure MongoDB is running: `docker-compose up mongodb -d` or start MongoDB manually

**Issue:** Services can't communicate
- **Solution:** Check service URLs in gateway configuration and ensure all services are running

