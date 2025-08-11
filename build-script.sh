#!/bin/bash
set -e

echo "🚀 Starting Render build..."

# Navigate to project root
cd "$(dirname "$0")"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Ensure Vite is available
echo "🔍 Checking Vite..."
if ! command -v ./node_modules/.bin/vite &> /dev/null; then
    echo "Installing Vite globally in frontend..."
    npm install --save-dev vite @vitejs/plugin-react
fi

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Verify build output
echo "✅ Build complete! Files:"
ls -la dist/

echo "🎉 Ready for deployment!"
