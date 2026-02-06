#!/bin/bash
set -e

echo "Setting up Coding Agent Benchmark..."

echo "Installing root dependencies..."
npm install

echo "Installing workspace dependencies..."
npm install --workspaces

echo "Building all packages..."
npm run build:all

echo "Initializing database..."
cd packages/backend
npm run dev &
SERVER_PID=$!
sleep 5
kill $SERVER_PID

echo ""
echo "Setup complete!"
echo "Run 'npm run benchmark' to start the benchmark"
