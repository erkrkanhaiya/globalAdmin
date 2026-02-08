#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║              🧪 Testing Health Endpoints                            ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

ports=(5001 5002 5003 5004 5005 5006)
names=("Main API" "Restaurant" "LiveNotes" "Cab Booking" "WhatsApp" "CRM")

for i in "${!ports[@]}"; do
    port=${ports[$i]}
    name=${names[$i]}
    url="http://localhost:$port/health"
    
    echo -n "Testing $name (port $port)... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "$url" 2>/dev/null)
    
    if [ "$response" = "200" ]; then
        echo "✅ OK"
        curl -s "$url" | head -3
    else
        echo "❌ FAILED (HTTP $response)"
        echo "   Server may not be running on port $port"
    fi
    echo ""
done

echo "════════════════════════════════════════════════════════════════════"
echo ""
echo "If all tests failed, run: ./fix-and-start.sh"

