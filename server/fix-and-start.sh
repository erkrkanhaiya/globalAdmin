#!/bin/bash

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║         🔧 FIXING ISSUES & STARTING ALL SERVERS                  ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Must run from server directory"
    echo "   Run: cd server && ./fix-and-start.sh"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
if [ ! -d "node_modules/morgan" ]; then
    echo "   Installing morgan and other dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""

# Step 2: Clean ports
echo "🧹 Step 2: Cleaning ports..."
for port in 5001 5002 5003 5004 5005 5006; do
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ ! -z "$pid" ]; then
        echo "   Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null || true
    fi
done
sleep 2
echo "✅ Ports cleaned"
echo ""

# Step 3: Check .env file
echo "🔍 Step 3: Checking configuration..."
if [ ! -f ".env" ]; then
    echo "⚠️  WARNING: .env file not found"
    echo "   Creating basic .env from env.example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file"
    else
        echo "❌ env.example not found. Please create .env manually"
        exit 1
    fi
else
    echo "✅ .env file exists"
fi

# Check SWAGGER_ENABLED
if ! grep -q "SWAGGER_ENABLED=true" .env 2>/dev/null; then
    echo "⚠️  Adding SWAGGER_ENABLED to .env..."
    echo "" >> .env
    echo "SWAGGER_ENABLED=true" >> .env
    echo "SWAGGER_USERNAME=admin" >> .env
    echo "SWAGGER_PASSWORD=I9dUyVAWjVVY6Cj4" >> .env
    echo "✅ Added Swagger config to .env"
fi

echo ""

# Step 4: Start servers
echo "🚀 Step 4: Starting all backend servers..."
echo ""
echo "Servers will start on:"
echo "  - Main API:        http://localhost:5001"
echo "  - Restaurant:      http://localhost:5002"
echo "  - LiveNotes:      http://localhost:5003"
echo "  - Cab Booking:     http://localhost:5004"
echo "  - WhatsApp:       http://localhost:5005"
echo "  - CRM:            http://localhost:5006"
echo ""
echo "Health checks:"
echo "  - http://localhost:5001/health"
echo "  - http://localhost:5002/health"
echo "  - http://localhost:5003/health"
echo "  - http://localhost:5004/health"
echo "  - http://localhost:5005/health"
echo "  - http://localhost:5006/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""
echo "════════════════════════════════════════════════════════════════════"
echo ""

# Start all servers
npm run dev:all:backends

