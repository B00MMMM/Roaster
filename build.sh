#!/bin/bash
# Build script for Render deployment

echo "🚀 Starting Render build..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Build frontend for production
echo "🏗️ Building frontend..."
npm run build

# Copy built files to backend/public for serving
echo "📂 Setting up static file serving..."
mkdir -p ../backend/public
cp -r dist/* ../backend/public/

echo "✅ Build complete!"
echo "📁 Frontend built to: backend/public/"
echo "🎯 Ready for deployment!"
