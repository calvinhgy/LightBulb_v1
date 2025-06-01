#!/bin/bash

# Change to the project directory
cd "$(dirname "$0")"

# Get the server's IP address
IP_ADDRESS=$(hostname -I | awk '{print $1}')
PORT=8000

# Copy the server index to index.html temporarily
cp server-index.html index.html.server
mv index.html index.html.original
mv index.html.server index.html

echo "Starting HTTP server for 五彩灯泡 Mobile (Colorful Light Bulbs)"
echo "Server running at:"
echo "  Local: http://localhost:${PORT}"
echo "  Network: http://${IP_ADDRESS}:${PORT}"
echo "  Public (if available): http://$(curl -s http://checkip.amazonaws.com):${PORT}"
echo ""
echo "Access from your iPhone by entering the Network or Public URL in your browser"
echo "Press Ctrl+C to stop the server"

# Start the Python HTTP server
python3 -m http.server ${PORT}

# Restore the original index.html when server stops
mv index.html.original index.html
