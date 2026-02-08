# How to Start All Servers

## Quick Start - All Servers

### Option 1: Using the npm script (Recommended)

```bash
cd /Users/victor/Documents/MydreamWorkspace/Ai/liveNotesWorkpace/globaladmin
npm run dev:all:complete
```

This will start:
- **Frontend Servers** (Ports 3000-3005):
  - 60YARD: http://localhost:3000
  - CRM: http://localhost:3001
  - LiveNotes: http://localhost:3002
  - RentalCabBooking: http://localhost:3003
  - WhatsAppAPI: http://localhost:3004
  - Restaurant: http://localhost:3005

- **Backend Servers** (Ports 5001-5006):
  - Main API: http://localhost:5001
  - Restaurant API: http://localhost:5002
  - LiveNotes API: http://localhost:5003
  - RentalCabBooking API: http://localhost:5004
  - WhatsAppAPI: http://localhost:5005
  - CRM API: http://localhost:5006

### Option 2: Using the shell script

```bash
cd /Users/victor/Documents/MydreamWorkspace/Ai/liveNotesWorkpace/globaladmin
./start-all-servers.sh
```

### Option 3: Start in separate terminals (Best for debugging)

**Terminal 1 - Frontend Servers:**
```bash
cd /Users/victor/Documents/MydreamWorkspace/Ai/liveNotesWorkpace/globaladmin
npm run dev:all:products
```

**Terminal 2 - Backend Servers:**
```bash
cd /Users/victor/Documents/MydreamWorkspace/Ai/liveNotesWorkpace/globaladmin/server
npx concurrently \
  "npm run dev" \
  "npm run dev:restaurant" \
  "npm run dev:livenotes" \
  "npm run dev:rentalcabbooking" \
  "npm run dev:whatsappapi" \
  "npm run dev:crm" \
  --names "MAIN-API,RESTAURANT-API,LIVENOTES-API,CAB-API,WHATSAPP-API,CRM-API" \
  --prefix-colors "gray,cyan,green,red,yellow,blue"
```

## Individual Server Commands

### Frontend Servers (from root directory)
```bash
npm run dev:60yard          # Port 3000
npm run dev:crm             # Port 3001
npm run dev:livenotes       # Port 3002
npm run dev:rentalcabbooking # Port 3003
npm run dev:whatsappapi     # Port 3004
npm run dev:restaurant      # Port 3005
```

### Backend Servers (from server directory)
```bash
cd server
npm run dev                 # Main API - Port 5001
npm run dev:restaurant      # Port 5002
npm run dev:livenotes       # Port 5003
npm run dev:rentalcabbooking # Port 5004
npm run dev:whatsappapi     # Port 5005
npm run dev:crm             # Port 5006
```

## Clean Ports

If ports are already in use:
```bash
npm run clean:ports
```

Or manually:
```bash
# Kill all processes on specific ports
lsof -ti:3000,3001,3002,3003,3004,3005,5001,5002,5003,5004,5005,5006 | xargs kill -9

# Kill all vite and tsx processes
pkill -9 -f 'vite|tsx watch'
```

## Verify Servers Are Running

### Check Ports
```bash
# Frontend
for port in 3000 3001 3002 3003 3004 3005; do
  lsof -ti:$port >/dev/null 2>&1 && echo "✅ Port $port: RUNNING" || echo "❌ Port $port: NOT RUNNING"
done

# Backend
for port in 5001 5002 5003 5004 5005 5006; do
  lsof -ti:$port >/dev/null 2>&1 && echo "✅ Port $port: RUNNING" || echo "❌ Port $port: NOT RUNNING"
done
```

### Health Checks
```bash
# Main API
curl http://localhost:5001/health

# Restaurant API
curl http://localhost:5002/health

# LiveNotes API
curl http://localhost:5003/health

# RentalCabBooking API
curl http://localhost:5004/health

# WhatsAppAPI
curl http://localhost:5005/health

# CRM API
curl http://localhost:5006/health
```

## Swagger Documentation

- Main API: http://localhost:5001/api-docs
- Restaurant API: http://localhost:5002/api-docs
- LiveNotes API: http://localhost:5003/api-docs
- RentalCabBooking API: http://localhost:5004/api-docs
- WhatsAppAPI: http://localhost:5005/api-docs
- CRM API: http://localhost:5006/api-docs

## Troubleshooting

### Port Already in Use
```bash
# Find what's using the port
lsof -i :5003

# Kill the process
kill -9 <PID>
```

### MongoDB Connection Issues
Make sure MongoDB is running:
```bash
mongosh --eval "db.adminCommand('ping')"
```

### Dependencies Not Installed
```bash
# Root directory
npm install

# Server directory
cd server
npm install
```

### Server Not Starting
1. Check the terminal output for errors
2. Verify `.env` file exists in `server/` directory
3. Check MongoDB connection string
4. Ensure all required environment variables are set

## Environment Variables

Make sure `server/.env` has:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `JWT_EXPIRE` - JWT expiration (e.g., "30d")
- `SWAGGER_ENABLED=true` - Enable Swagger docs
- `GOOGLE_CLIENT_ID` - For Google Sign-In (optional)
