#!/bin/bash
# Script to restart the server and ensure .env is loaded

echo "🔄 Restarting server..."
echo ""
echo "Make sure to:"
echo "1. Stop the current server (Ctrl+C if running in terminal)"
echo "2. Run: npm start"
echo ""
echo "Or if using PM2:"
echo "  pm2 restart streamdiffusion"
echo ""
echo "The server needs to be restarted to load the updated .env file!"

