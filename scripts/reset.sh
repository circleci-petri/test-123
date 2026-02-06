#!/bin/bash
set -e

echo "=== Resetting Coding Agent Benchmark ==="
echo ""
echo "This will restore all source files to their original buggy state."
echo ""

# Prompt for confirmation
read -p "Are you sure you want to reset? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "Reset cancelled."
    exit 0
fi

echo ""
echo "Resetting backend source files..."
rm -rf packages/backend/src
cp -r baseline/backend/src packages/backend/

echo "Resetting frontend source files..."
rm -rf packages/frontend/src
cp -r baseline/frontend/src packages/frontend/

echo ""
echo "Cleaning generated files..."
rm -f score-results.json
rm -f benchmark-report.md
rm -f security-audit.json
rm -f performance-metrics.json

echo ""
echo "Cleaning build artifacts..."
rm -rf packages/backend/dist
rm -rf packages/frontend/dist
rm -rf packages/scoring/dist

echo ""
echo "Cleaning database..."
rm -f packages/backend/database/app.db

echo ""
echo "Cleaning test results..."
rm -rf packages/backend/test-results
rm -rf packages/frontend/test-results
rm -rf playwright-report
rm -rf packages/frontend/playwright-report

echo ""
echo "✅ Reset complete!"
echo ""
echo "All bugs have been restored to their original state."
echo "Score should now be ~36/100 (baseline with bugs present)."
echo ""
echo "Next steps:"
echo "  1. Run: npm run build:all"
echo "  2. Run: npm run benchmark"
echo "  3. Start fixing bugs!"
