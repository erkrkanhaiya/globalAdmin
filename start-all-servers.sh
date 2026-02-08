#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Function to display URLs
display_urls() {
  echo ""
  echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║                    📋 ALL SERVER URLs                                    ║${NC}"
  echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}🌐 FRONTEND SERVERS:${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "  ${GREEN}60YARD:${NC}        http://localhost:3000"
  echo -e "  ${GREEN}CRM:${NC}            http://localhost:3001"
  echo -e "  ${GREEN}LiveNotes:${NC}     http://localhost:3002"
  echo -e "  ${GREEN}RentalCab:${NC}     http://localhost:3003"
  echo -e "  ${GREEN}WhatsAppAPI:${NC}   http://localhost:3004"
  echo -e "  ${GREEN}Restaurant:${NC}    http://localhost:3005"
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${YELLOW}🔧 BACKEND SERVERS:${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "  ${GREEN}Main API:${NC}      http://localhost:5001"
  echo -e "    ${BLUE}Health:${NC}       http://localhost:5001/health"
  echo -e "    ${BLUE}API Docs:${NC}     http://localhost:5001/api-docs"
  echo ""
  echo -e "  ${GREEN}Restaurant API:${NC} http://localhost:5002"
  echo -e "    ${BLUE}Health:${NC}       http://localhost:5002/health"
  echo -e "    ${BLUE}API Docs:${NC}     http://localhost:5002/api-docs"
  echo ""
  echo -e "  ${GREEN}LiveNotes API:${NC}  http://localhost:5003"
  echo -e "    ${BLUE}Health:${NC}       http://localhost:5003/health"
  echo -e "    ${BLUE}API Docs:${NC}     http://localhost:5003/api-docs"
  echo ""
  echo -e "  ${GREEN}RentalCab API:${NC}  http://localhost:5004"
  echo -e "    ${BLUE}Health:${NC}       http://localhost:5004/health"
  echo -e "    ${BLUE}API Docs:${NC}     http://localhost:5004/api-docs"
  echo ""
  echo -e "  ${GREEN}WhatsApp API:${NC}   http://localhost:5005"
  echo -e "    ${BLUE}Health:${NC}       http://localhost:5005/health"
  echo -e "    ${BLUE}API Docs:${NC}     http://localhost:5005/api-docs"
  echo ""
  echo -e "  ${GREEN}CRM API:${NC}        http://localhost:5006"
  echo -e "    ${BLUE}Health:${NC}       http://localhost:5006/health"
  echo -e "    ${BLUE}API Docs:${NC}     http://localhost:5006/api-docs"
  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
}

echo -e "${GREEN}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║      🚀 Starting ALL Development Servers (Frontend + Backend)            ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Clean ports first
echo -e "${YELLOW}🧹 Cleaning ports...${NC}"
npm run clean:ports
sleep 2

# Display URLs before starting
display_urls

# Start all servers using concurrently
echo -e "${YELLOW}🚀 Starting all servers...${NC}"
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}📝 Server logs will appear below. Watch for any errors!${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$(dirname "$0")"

# Start all frontend and backend servers with error handling
npx concurrently \
  --kill-others-on-fail \
  --restart-tries 3 \
  --restart-after 2000 \
  --names "60YARD-F,CRM-F,LIVENOTES-F,CAB-F,WHATSAPP-F,RESTAURANT-F,MAIN-API,RESTAURANT-API,LIVENOTES-API,CAB-API,WHATSAPP-API,CRM-API" \
  --prefix-colors "cyan,green,red,yellow,blue,magenta,gray,cyan,green,red,yellow,blue" \
  "npm run dev:60yard" \
  "npm run dev:crm" \
  "npm run dev:livenotes" \
  "npm run dev:rentalcabooking" \
  "npm run dev:whatsappapi" \
  "npm run dev:restaurant" \
  "npm run dev:backend" \
  "cd server && npm run dev:restaurant" \
  "cd server && npm run dev:livenotes" \
  "cd server && npm run dev:rentalcabooking" \
  "cd server && npm run dev:whatsappapi" \
  "cd server && npm run dev:crm" \
  || {
    echo ""
    echo -e "${RED}╔══════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    ❌ SERVER STARTUP FAILED                                ║${NC}"
    echo -e "${RED}╚══════════════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}One or more servers failed to start. Check the logs above for details.${NC}"
    echo ""
    echo -e "${YELLOW}Common issues:${NC}"
    echo -e "  • Port already in use - run 'npm run clean:ports'"
    echo -e "  • Missing dependencies - run 'npm install' in root and 'cd server && npm install'"
    echo -e "  • Environment variables missing - check .env file"
    echo ""
    exit 1
  }
