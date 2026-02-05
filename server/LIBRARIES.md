# Installed Libraries & Configuration

This document lists all the libraries installed and their purposes.

## 📦 Core Dependencies

### Security
- **helmet** - Security headers for Express
- **hpp** - HTTP Parameter Pollution protection
- **express-rate-limit** - Rate limiting middleware
- **cors** - Cross-Origin Resource Sharing

### Authentication & Authorization
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation and verification

### Database
- **mongoose** - MongoDB ODM

### Validation
- **express-validator** - Input validation
- **zod** - Schema validation (type-safe)
- **validator** - String validation utilities

### Logging & Monitoring
- **pino** - Fast JSON logger (replaces morgan)
- **pino-pretty** - Pretty print for Pino in development
- **response-time** - Response time tracking
- **prom-client** - Prometheus metrics (monitoring)

### File Upload & Storage
- **multer** - File upload handling
- **cloudinary** - Image hosting and transformation
- **aws-sdk** - AWS services (S3 for file storage)

### Caching & Queues
- **ioredis** - Redis client
- **bull** - Job queue manager
- **@bull-board/express** - Bull queue dashboard UI

### API Documentation
- **swagger-ui-express** - Swagger UI for Express
- **swagger-jsdoc** - Generate Swagger docs from JSDoc
- **yamljs** - YAML parser

### Utilities
- **lodash** - Utility functions
- **uuid** - UUID generation
- **nanoid** - URL-friendly unique ID generation
- **dayjs** - Date manipulation (lightweight)
- **slugify** - URL-friendly string generation
- **axios** - HTTP client
- **compression** - Response compression

### Framework
- **express** - Web framework
- **dotenv** - Environment variables

## 🛠️ Development Dependencies

### Code Quality
- **eslint** - Linting
- **prettier** - Code formatting
- **eslint-config-prettier** - ESLint config for Prettier
- **eslint-plugin-prettier** - Prettier as ESLint plugin
- **husky** - Git hooks
- **lint-staged** - Run linters on staged files

### Testing
- **jest** - Testing framework
- **@types/jest** - Jest TypeScript types
- **ts-jest** - TypeScript support for Jest

### Development Tools
- **nodemon** - Auto-restart on file changes
- **ts-node** - TypeScript execution
- **tsx** - Fast TypeScript execution
- **typescript** - TypeScript compiler

### Type Definitions
- All `@types/*` packages for TypeScript support

## 📁 Configuration Files

### Code Quality
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to ignore for Prettier
- `.eslintrc.json` - ESLint configuration
- `.lintstagedrc.json` - Lint-staged configuration

### Testing
- `jest.config.js` - Jest configuration

### Git Hooks
- `.husky/pre-commit` - Pre-commit hook for linting

## 🔧 Configuration Modules

### `src/config/`
- **env.ts** - Environment variables configuration
- **database.ts** - MongoDB connection
- **redis.ts** - Redis client configuration
- **logger.ts** - Pino logger setup
- **rateLimit.ts** - Rate limiting configuration
- **swagger.ts** - Swagger/OpenAPI documentation setup
- **upload.ts** - Multer file upload configuration
- **cloudinary.ts** - Cloudinary integration
- **s3.ts** - AWS S3 integration
- **queue.ts** - Bull queue setup

### `src/utils/`
- **helpers.ts** - Utility functions (ID generation, date handling, validation, etc.)

## 🚀 Usage Examples

### Rate Limiting
```typescript
import { apiLimiter, authLimiter } from './config/rateLimit.js'
app.use('/api', apiLimiter)
router.post('/login', authLimiter, login)
```

### File Upload
```typescript
import { uploadSingle, uploadMultiple } from './config/upload.js'
router.post('/upload', uploadSingle('file'), uploadController)
```

### Logging
```typescript
import { logger } from './config/logger.js'
logger.info('Server started')
logger.error({ error }, 'Something went wrong')
```

### Redis Caching
```typescript
import { getRedisClient } from './config/redis.js'
const redis = getRedisClient()
await redis.set('key', 'value')
```

### Job Queue
```typescript
import { emailQueue } from './config/queue.js'
await emailQueue.add('send-email', { to: 'user@example.com' })
```

### Swagger Documentation
Access at: `http://localhost:5000/api-docs` (when enabled)

### Bull Board
Access at: `http://localhost:5000/admin/queues` (development mode)

## 📝 Environment Variables

All environment variables are documented in `env.example`. Key categories:

- Server configuration
- MongoDB connection
- JWT settings
- Rate limiting
- Redis configuration
- File upload settings
- Cloudinary credentials
- AWS S3 credentials
- Swagger settings
- Logging configuration
- Monitoring settings

## 🔄 Next Steps

1. Install dependencies: `npm install`
2. Configure environment: `cp env.example .env`
3. Set up Redis (optional but recommended for queues)
4. Configure Cloudinary or AWS S3 for file storage
5. Start using the utilities and configurations!

