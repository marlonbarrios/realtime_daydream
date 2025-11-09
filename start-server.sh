#!/bin/bash
# Script to start the server with proper environment

echo "🚀 Starting StreamDiffusion server..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "   Copy env.example to .env and add your API key"
    exit 1
fi

# Check if API key is set
if ! grep -q "DAYDREAM_API_KEY=sk_" .env 2>/dev/null; then
    echo "⚠️  WARNING: API key might not be set correctly in .env"
    echo "   Make sure DAYDREAM_API_KEY starts with 'sk_'"
fi

echo "✅ Starting server..."
echo "   Press Ctrl+C to stop"
echo ""

npm start

