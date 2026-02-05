import dotenv from 'dotenv'

dotenv.config()

// Determine environment - prefer explicit ENVIRONMENT variable, then NODE_ENV
const getEnvironment = (): 'development' | 'production' | 'staging' => {
  // Check for explicit ENVIRONMENT variable first
  if (process.env.ENVIRONMENT) {
    const env = process.env.ENVIRONMENT.toLowerCase()
    if (env === 'production' || env === 'prod') return 'production'
    if (env === 'staging' || env === 'stage') return 'staging'
    if (env === 'development' || env === 'dev') return 'development'
  }
  
  // Fall back to NODE_ENV
  const nodeEnv = process.env.NODE_ENV?.toLowerCase()
  if (nodeEnv === 'production') return 'production'
  if (nodeEnv === 'staging') return 'staging'
  
  // Default to development if not explicitly set
  return 'development'
}

export const config = {
  // Server
  NODE_ENV: getEnvironment(),
  PORT: parseInt(process.env.PORT || '5000', 10),

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_panel',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'admin_panel',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // API
  API_PREFIX: process.env.API_PREFIX || '/api/v1',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Redis
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT || '6379', 10),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_DB: parseInt(process.env.REDIS_DB || '0', 10),

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB default
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // AWS S3
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME || '',

  // Bull Queue
  BULL_REDIS_HOST: process.env.BULL_REDIS_HOST || 'localhost',
  BULL_REDIS_PORT: parseInt(process.env.BULL_REDIS_PORT || '6379', 10),
  BULL_REDIS_PASSWORD: process.env.BULL_REDIS_PASSWORD || '',
  BULL_REDIS_DB: parseInt(process.env.BULL_REDIS_DB || '1', 10),

  // Swagger
  SWAGGER_ENABLED: process.env.SWAGGER_ENABLED === 'true',
  SWAGGER_PATH: process.env.SWAGGER_PATH || '/api-docs',

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || './logs/app.log',

  // Monitoring
  METRICS_ENABLED: process.env.METRICS_ENABLED === 'true',
  METRICS_PATH: process.env.METRICS_PATH || '/metrics',

  // Google OAuth
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',

  // API Basic Authentication (for mobile app/public endpoints)
  // These credentials must be included in HTTP Basic Auth header for all public endpoints
  API_KEY: process.env.API_KEY || '',
  API_SECRET: process.env.API_SECRET || '',

  // Swagger Basic Authentication (simple password protection)
  SWAGGER_USERNAME: process.env.SWAGGER_USERNAME || 'admin',
  SWAGGER_PASSWORD: process.env.SWAGGER_PASSWORD || 'I9dUyVAWjVVY6Cj4',
}

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET']

if (config.NODE_ENV === 'production') {
  requiredEnvVars.push('API_KEY', 'API_SECRET')
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      console.error(`❌ Missing required environment variable: ${varName}`)
      process.exit(1)
    }
  })
}

