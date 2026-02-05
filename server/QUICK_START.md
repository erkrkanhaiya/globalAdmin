# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set Up Environment
```bash
cp env.example .env
# Edit .env with your MongoDB connection string
```

### 3. Start MongoDB
Make sure MongoDB is running on your system.

### 4. Seed Database (Optional)
```bash
npm run seed
```

This creates:
- Admin user: `admin@example.com` / `admin123`
- Manager user: `manager@example.com` / `manager123`
- User: `user@example.com` / `user123`
- Sample agents and properties

### 5. Start Server
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## 📡 Test the API

### Health Check
```bash
curl http://localhost:5000/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Get Agents (with token)
```bash
curl http://localhost:5000/api/v1/agents \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/          # Database & env config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, errors
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── scripts/         # Utility scripts
│   └── index.ts         # Entry point
├── .env                 # Your environment variables
├── env.example          # Template
└── package.json
```

## 🔑 API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Agents
- `GET /api/v1/agents` - List all
- `GET /api/v1/agents/:id` - Get one
- `POST /api/v1/agents` - Create (Admin/Manager)
- `PUT /api/v1/agents/:id` - Update (Admin/Manager)
- `DELETE /api/v1/agents/:id` - Delete (Admin)

### Properties
- `GET /api/v1/properties` - List all
- `GET /api/v1/properties/:id` - Get one
- `POST /api/v1/properties` - Create (Admin/Manager)
- `PUT /api/v1/properties/:id` - Update (Admin/Manager)
- `DELETE /api/v1/properties/:id` - Delete (Admin)

### Auction Requests
- `GET /api/v1/auction-requests` - List all (Admin)
- `POST /api/v1/auction-requests` - Submit
- `PUT /api/v1/auction-requests/:id/approve` - Approve (Admin)
- `PUT /api/v1/auction-requests/:id/decline` - Decline (Admin)

## 🛠️ Available Scripts

- `npm run dev` - Start development server (watch mode)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run lint` - Run ESLint

## 📝 Next Steps

1. Update frontend `.env` with `VITE_API_URL=http://localhost:5000/api/v1`
2. Update frontend API calls to use real endpoints
3. Customize models and controllers for your needs
4. Add more features as required

See `README.md` for detailed documentation.

