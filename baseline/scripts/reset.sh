#!/bin/bash
set -e

# Always run from project root, regardless of where script is invoked from
cd "$(dirname "$0")/.."

echo "=== Resetting Coding Agent Benchmark ==="
echo ""
echo "This will restore all files to their original state for a fresh benchmark run."
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

echo "Resetting database files..."
cp baseline/backend/database/schema.sql packages/backend/database/schema.sql
cp baseline/backend/database/seed.sql packages/backend/database/seed.sql

echo "Resetting test files..."
cp baseline/backend/tests/setup.ts packages/backend/tests/setup.ts
cp baseline/backend/tests/integration/cart.test.ts packages/backend/tests/integration/cart.test.ts
cp baseline/backend/tests/integration/products.test.ts packages/backend/tests/integration/products.test.ts
rm -f packages/backend/tests/integration/checkout.test.ts
cp baseline/backend/tests/security/auth.test.ts packages/backend/tests/security/auth.test.ts
cp baseline/backend/tests/unit/cartService.test.ts packages/backend/tests/unit/cartService.test.ts
cp baseline/backend/tests/unit/helpers.test.ts packages/backend/tests/unit/helpers.test.ts
cp baseline/backend/tests/unit/validation.test.ts packages/backend/tests/unit/validation.test.ts
cp baseline/frontend/tests/unit/CartItem.test.tsx packages/frontend/tests/unit/CartItem.test.tsx

echo "Resetting scoring files..."
cp baseline/scoring/src/collectors/testCollector.ts packages/scoring/src/collectors/testCollector.ts
cp baseline/scoring/src/scoring/baseline.ts packages/scoring/src/scoring/baseline.ts

echo "Resetting benchmark script..."
cp baseline/scripts/run-benchmark.sh scripts/run-benchmark.sh
chmod +x scripts/run-benchmark.sh

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
echo "Cleaning test results and coverage..."
rm -rf packages/backend/test-results
rm -rf packages/backend/coverage
rm -rf packages/frontend/test-results
rm -rf playwright-report
rm -rf packages/frontend/playwright-report

echo ""
echo "Reset complete!"
echo ""
echo "All bugs have been restored to their original state."
echo "Score should now be ~36/100 (baseline with bugs present)."
echo ""
echo "Next steps:"
echo "  1. Run: npm run build:all"
echo "  2. Run: npm run benchmark"
echo "  3. Start fixing bugs!"
