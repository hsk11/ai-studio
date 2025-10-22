#!/bin/bash

echo "🚀 Setting up AI Studio for local development..."

# Navigate to project root
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --legacy-peer-deps
cd ..

# Copy environment files
echo "📝 Setting up environment files..."
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

echo "✅ Setup complete!"

echo ""
echo "🚀 To start the application:"
echo "   Terminal 1: cd backend && npm run dev"
echo "   Terminal 2: cd frontend && npm start"

echo ""
echo "📋 Access points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo "   API Docs: http://localhost:3001/docs"