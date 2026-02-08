# 🚀 Start All Backend Servers

## Quick Start

```bash
cd server
npm install
npm run dev:all:backends
```

## What This Does

Starts all 6 backend API servers on different ports:

| Server | Port | URL | Swagger |
|--------|------|-----|---------|
| Main API | 5001 | http://localhost:5001 | http://localhost:5001/api-docs |
| Restaurant | 5002 | http://localhost:5002 | http://localhost:5002/api-docs |
| LiveNotes | 5003 | http://localhost:5003 | http://localhost:5003/api-docs |
| Cab Booking | 5004 | http://localhost:5004 | http://localhost:5004/api-docs |
| WhatsApp | 5005 | http://localhost:5005 | http://localhost:5005/api-docs |
| CRM | 5006 | http://localhost:5006 | http://localhost:5006/api-docs |

## Swagger Login

- Username: `admin`
- Password: `I9dUyVAWjVVY6Cj4`

## Troubleshooting

### If you see "Cannot find package 'morgan'"
```bash
cd server
npm install
```

### If ports are already in use
```bash
lsof -ti:5001,5002,5003,5004,5005,5006 | xargs kill -9
```

### To stop all servers
Press `Ctrl+C` in the terminal where servers are running

## Individual Server Commands

```bash
cd server

# Main API
PORT=5001 npm run dev

# Restaurant
npm run dev:restaurant

# LiveNotes
npm run dev:livenotes

# Cab Booking
npm run dev:rentalcabbooking

# WhatsApp
npm run dev:whatsappapi

# CRM
npm run dev:crm
```

