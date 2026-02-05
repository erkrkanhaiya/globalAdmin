# Environment Configuration Guide

This guide explains how to configure environment variables for development and production.

## Files Created

### Backend (Server) Environment Files
- `server/.env` - Development environment configuration
- `server/.env.production` - Production environment configuration

### Frontend Environment Files
- `.env` - Development environment configuration
- `.env.production` - Production environment configuration

## Environment Detection

The server uses a priority-based environment detection:

1. **ENVIRONMENT** variable (highest priority)
   - Can be set to: `development`, `staging`, or `production`
   - Also accepts: `dev`, `stage`, or `prod`

2. **NODE_ENV** variable (fallback)
   - Standard Node.js environment variable

3. **Production Domain Check** (safety fallback)
   - If the request comes from `60yard.com` or `api.60yard.com`, it automatically detects production

## Development Setup

### Backend (Server)
1. Use `server/.env` file
2. Set `ENVIRONMENT=development` or `NODE_ENV=development`
3. Update MongoDB URI if needed
4. Update CORS_ORIGIN to include your local frontend URL

### Frontend
1. Use `.env` file
2. Set `VITE_API_URL=http://localhost:5000/api/v1`

## Production Setup

### Backend (Server)
1. Use `server/.env.production` or set environment variables directly
2. **IMPORTANT**: Set `ENVIRONMENT=production` or `NODE_ENV=production`
3. Update `JWT_SECRET` to a strong random string:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
4. Update `MONGODB_URI` with production database
5. Update `CORS_ORIGIN` with production frontend domains
6. Set `SWAGGER_ENABLED=false` for security

### Frontend
1. Use `.env.production` file
2. Set `VITE_API_URL=https://api.60yard.com/api/v1`

## Environment Variables Reference

### Server Environment Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `ENVIRONMENT` | `development` | `production` | Environment identifier |
| `NODE_ENV` | `development` | `production` | Node.js environment |
| `PORT` | `5000` | `5000` | Server port |
| `MONGODB_URI` | Development DB | Production DB | MongoDB connection string |
| `JWT_SECRET` | Dev secret | Strong random | JWT signing secret |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://admin.60yard.com` | Allowed CORS origins |
| `SWAGGER_ENABLED` | `true` | `false` | Enable API documentation |

### Frontend Environment Variables

| Variable | Development | Production | Description |
|----------|-------------|------------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api/v1` | `https://api.60yard.com/api/v1` | Backend API URL |

## Verification

### Check Backend Environment
```bash
curl http://localhost:5000/health
# Should return: {"status":"success","environment":"development",...}
```

### Check Production Environment
```bash
curl https://api.60yard.com/health
# Should return: {"status":"success","environment":"production",...}
```

## Important Notes

1. **Never commit `.env` files** to version control
2. **Always use strong secrets** in production
3. **Update CORS_ORIGIN** to include your actual frontend domains
4. **Disable Swagger** in production (`SWAGGER_ENABLED=false`)
5. **Use environment variables** in production deployments instead of files when possible

## Switching Between Environments

### Development
```bash
# Backend
cd server
# .env file is automatically loaded
npm run dev

# Frontend
# .env file is automatically loaded by Vite
npm run dev
```

### Production
```bash
# Backend - Use production env file or set ENVIRONMENT variable
ENVIRONMENT=production npm start

# Or copy production file
cp .env.production .env

# Frontend - Build with production env
npm run build
# Vite will use .env.production automatically
```

## Troubleshooting

### Environment shows "development" in production
- Ensure `ENVIRONMENT=production` or `NODE_ENV=production` is set
- The health endpoint will auto-detect production if accessed from `60yard.com`

### CORS errors
- Check `CORS_ORIGIN` includes your frontend domain
- In production, use `https://` URLs

### API connection errors
- Verify `VITE_API_URL` in frontend `.env` matches backend URL
- Check backend is running and accessible

