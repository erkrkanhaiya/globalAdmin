# How to Start Servers

## Quick Start (Both Servers)

```bash
cd /Users/victor/Documents/MydreamWorkspace/Ai/liveNotesWorkpace/globaladmin

# Start both frontend and backend
npm run dev:all
```

## Start Separately

### Backend Only
```bash
cd server
npm run dev
```
Backend runs on: http://localhost:5001

### Frontend Only
```bash
npm run dev
```
Frontend runs on: http://localhost:3000 or http://localhost:5173

## Troubleshooting

### Backend Not Starting

1. **Check MongoDB Connection**
   ```bash
   # Verify MongoDB is running
   mongosh --eval "db.adminCommand('ping')"
   ```

2. **Check .env file**
   ```bash
   cd server
   cat .env | grep MONGODB_URI
   ```

3. **Check Port**
   ```bash
   # Kill process on port 5001 if needed
   lsof -ti:5001 | xargs kill -9
   ```

4. **Check Logs**
   - Look at terminal output for errors
   - Common errors:
     - MongoDB connection failed
     - Port already in use
     - Missing environment variables

### Frontend Not Starting

1. **Check Port**
   ```bash
   # Kill process on port 3000 or 5173
   lsof -ti:3000,5173 | xargs kill -9
   ```

2. **Clear Vite Cache**
   ```bash
   rm -rf node_modules/.vite
   ```

3. **Reinstall Dependencies**
   ```bash
   rm -rf node_modules
   npm install
   ```

## Verify Servers Are Running

```bash
# Check backend
curl http://localhost:5001/health

# Check frontend
curl http://localhost:3000
```

## Environment Setup

Make sure `server/.env` has:
- `PORT=5001` (or desired port)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `SWAGGER_ENABLED=true` - Enable Swagger docs

## First Time Setup

1. **Seed Products**
   ```bash
   cd server
   npm run seed:products
   ```

2. **Seed Admins**
   ```bash
   npm run seed:admins
   ```

3. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001
   - Swagger: http://localhost:5001/api-docs
