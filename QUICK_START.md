# Quick Start Guide

## Running the Project

### Option 1: Run Everything Together (Recommended)
```bash
cd /Users/victor/Documents/MydreamWorkspace/Ai/liveNotesWorkpace/globaladmin
npm run dev:all
```

This starts both frontend and backend together.

### Option 2: Run Separately

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
npm run dev
```

## Initial Setup

### 1. Seed Products
```bash
cd server
npm run seed:products
```

### 2. Seed Admins
```bash
cd server
npm run seed:admins
```

This creates:
- **Super Admin**: `superadmin@example.com` / `superadmin123` (all products)
- **Restaurant Admin**: `restaurant@admin.com` / `restaurant123` (restaurant only)
- **LiveNotes Admin**: `livenotes@admin.com` / `livenotes123` (livenotes only)
- And more...

## Access Points

- **Frontend**: http://localhost:5173 (or 3000)
- **Backend API**: http://localhost:5001
- **Swagger Docs**: http://localhost:5001/api-docs
  - Username: `admin`
  - Password: `I9dUyVAWjVVY6Cj4`

## Product-Specific Servers

Each product can run independently:

```bash
# Restaurant (Port 5002)
npm run dev:restaurant

# LiveNotes (Port 5003)
npm run dev:livenotes

# RentalCabBooking (Port 5004)
npm run dev:rentalcabbooking

# WhatsAppAPI (Port 5005)
npm run dev:whatsappapi

# CRM (Port 5006)
npm run dev:crm
```

Each has its own Swagger docs at `http://localhost:PORT/api-docs`

## Login Flow

1. Go to http://localhost:5173
2. Login with any admin credentials
3. You'll be redirected to product selection
4. Select a product to manage
5. All data shown is specific to that product

## Environment Variables

Make sure `.env` file exists in `server/` directory with:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `PORT` - Server port (default: 5001)
- `SWAGGER_ENABLED=true` - Enable Swagger docs

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:5001,5173 | xargs kill -9
```

### MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string in `.env`
- For local MongoDB: `mongodb://localhost:27017`

### Dependencies Not Installed
```bash
cd server && npm install
cd .. && npm install
```
