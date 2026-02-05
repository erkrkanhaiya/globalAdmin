# Backend API Setup Guide

This guide will help you set up the Node.js backend API server with MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher) - either locally installed or MongoDB Atlas account
- npm or yarn

## Installation Steps

### 1. Install Backend Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

### 2. Set Up MongoDB

#### Option A: Local MongoDB

If you have MongoDB installed locally, make sure it's running:

```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update the `MONGODB_URI` in your `.env` file

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit `.env` and update the following variables:

```env
NODE_ENV=development
PORT=5000

# MongoDB - Update this with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/admin_panel
MONGODB_DB_NAME=admin_panel

# JWT - Change this to a strong random string in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS - Update with your frontend URL
CORS_ORIGIN=http://localhost:5173

# API - API prefix for all routes
API_PREFIX=/api/v1
```

### 4. Update Frontend API URL

Update the frontend `.env` or `.env.local` file (create if it doesn't exist):

```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 5. Start the Backend Server

```bash
cd server
npm run dev
```

The server should start on `http://localhost:5000`

### 6. Verify Setup

1. Check health endpoint: `http://localhost:5000/health`
2. You should see: `{"status":"success","message":"Server is running",...}`

## API Endpoints

Once the server is running, you can access:

- **Health Check**: `GET http://localhost:5000/health`
- **API Base**: `http://localhost:5000/api/v1`

### Example API Calls

#### Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "admin"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

## Project Structure

```
server/
├── src/
│   ├── config/          # Database & environment config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── index.ts         # Server entry point
├── .env                 # Environment variables (create this)
├── env.example          # Environment template
├── package.json
└── tsconfig.json
```

## Development

- **Development Mode**: `npm run dev` (auto-reloads on changes)
- **Build**: `npm run build` (compiles TypeScript)
- **Production**: `npm start` (runs compiled code)

## Troubleshooting

### MongoDB Connection Issues

1. **Check if MongoDB is running**:
   ```bash
   # macOS/Linux
   ps aux | grep mongod
   
   # Or check MongoDB logs
   tail -f /usr/local/var/log/mongodb/mongo.log
   ```

2. **Check connection string**: Make sure `MONGODB_URI` in `.env` is correct

3. **Firewall**: Make sure port 27017 (MongoDB default) is not blocked

### Port Already in Use

If port 5000 is already in use, change `PORT` in `.env`:

```env
PORT=5001
```

### TypeScript Errors

Make sure all dependencies are installed:

```bash
cd server
npm install
```

## Next Steps

1. Create a default admin user (you can use the register endpoint)
2. Test the API endpoints using Postman or curl
3. Update frontend API calls to use the new backend
4. Add more features as needed

## Production Deployment

For production:

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Update `CORS_ORIGIN` to your production frontend URL
4. Use MongoDB Atlas or a managed MongoDB service
5. Set up proper logging and monitoring
6. Use environment variables for all sensitive data

