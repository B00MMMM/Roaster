#!/bin/bash
echo "🚀 Starting build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend install failed"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend install failed"
    exit 1
fi

# Verify Vite is available
echo "🔍 Verifying Vite installation..."
npx vite --version
if [ $? -ne 0 ]; then
    echo "❌ Vite not found, installing..."
    npm install vite @vitejs/plugin-react
fi

# Build frontend
echo "🏗️ Building frontend..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
ls -la dist/
