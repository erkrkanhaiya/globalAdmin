#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║         🔧 Installing Dependencies & Starting Servers              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed"
echo ""

# Clean ports
echo "🧹 Cleaning ports..."
lsof -ti:5001,5002,5003,5004,5005,5006 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 2

# Start all servers
echo "🚀 Starting all backend servers..."
echo ""

npm run dev:all:backends

