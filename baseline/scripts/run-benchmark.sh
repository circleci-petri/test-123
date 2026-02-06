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
echo "Step 3: Calculating score..."
npm run score:calculate

echo ""
echo "Step 4: Generating report..."
npm run score:report

echo ""
echo "=== Benchmark Complete ==="
echo "Report: benchmark-report.md"
echo "Results: score-results.json"
