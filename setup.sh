#!/bin/bash

# Setup script for Multiplication Drill project

echo "🚀 Setting up Multiplication Drill project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/__tests__
mkdir -p .github/workflows

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run initial build
echo "🔨 Running initial build..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm test

echo "✨ Setup complete! You can now:"
echo "  - Run 'npm run dev' to start the development server"
echo "  - Run 'npm test' to run tests"
echo "  - Run 'npm run build' to build for production"