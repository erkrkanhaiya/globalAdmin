#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      🚀 Starting ALL Development Servers (Frontend + Backend)      ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Clean ports first
echo -e "${YELLOW}🧹 Cleaning ports...${NC}"
npm run clean:ports
sleep 2

# Start all servers using concurrently
echo -e "${YELLOW}🚀 Starting all servers...${NC}"
echo ""

cd "$(dirname "$0")"

# Start all frontend and backend servers
npx concurrently \
  --kill-others-on-fail \
  --restart-tries 3 \
  --restart-after 2000 \
  --names "60YARD-F,CRM-F,LIVENOTES-F,CAB-F,WHATSAPP-F,RESTAURANT-F,MAIN-API,RESTAURANT-API,LIVENOTES-API,CAB-API,WHATSAPP-API,CRM-API" \
  --prefix-colors "cyan,green,red,yellow,blue,magenta,gray,cyan,green,red,yellow,blue" \
  "npm run dev:60yard" \
  "npm run dev:crm" \
  "npm run dev:livenotes" \
  "npm run dev:rentalcabbooking" \
  "npm run dev:whatsappapi" \
  "npm run dev:restaurant" \
  "npm run dev:backend" \
  "cd server && npm run dev:restaurant" \
  "cd server && npm run dev:livenotes" \
  "cd server && npm run dev:rentalcabbooking" \
  "cd server && npm run dev:whatsappapi" \
  "cd server && npm run dev:crm"
