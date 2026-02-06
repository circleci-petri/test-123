#!/bin/bash
set -e

echo "=== Coding Agent Benchmark ==="
echo ""

echo "Step 1: Installing dependencies..."
npm install

echo ""
echo "Step 2: Building packages..."
npm run build:all

echo ""
echo "Step 3: Running backend tests..."
npm run test:backend:unit || true
npm run test:backend:integration || true

echo ""
echo "Step 4: Running frontend tests..."
npm run test:frontend:unit || true

echo ""
echo "Step 5: Running security tests..."
npm run test:security || true

echo ""
echo "Step 6: Calculating score..."
npm run score:calculate

echo ""
echo "Step 7: Generating report..."
npm run score:report

echo ""
echo "=== Benchmark Complete ==="
echo "Report: benchmark-report.md"
echo "Results: score-results.json"
