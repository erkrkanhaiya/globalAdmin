#!/bin/bash

# Start all backend servers with error visibility

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║         🚀 Starting All Backend Servers                              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

cd "$(dirname "$0")"

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found in server directory!"
    echo "   Please create .env file with required configuration."
    exit 1
fi

# Clean ports first
echo "🧹 Cleaning ports..."
lsof -ti:5001,5002,5003,5004,5005,5006 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 2

echo "🚀 Starting servers..."
echo ""

# Start all servers with visible output
npx concurrently \
  --kill-others-on-fail \
  --restart-tries 2 \
  --restart-after 3000 \
  --names "MAIN-API,RESTAURANT-API,LIVENOTES-API,CAB-API,WHATSAPP-API,CRM-API" \
  --prefix-colors "gray,cyan,green,red,yellow,blue" \
  "PORT=5001 npm run dev" \
  "PORT=5002 npm run dev:restaurant" \
  "PORT=5003 npm run dev:livenotes" \
  "PORT=5004 npm run dev:rentalcabbooking" \
  "PORT=5005 npm run dev:whatsappapi" \
  "PORT=5006 npm run dev:crm"
