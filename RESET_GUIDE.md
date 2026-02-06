# Reset Guide

How to reset the benchmark between AI agent tests.

## Quick Reset

```bash
npm run reset
# or
./scripts/reset.sh
```

## What Gets Reset

### ✅ Restored
- All backend source files (`packages/backend/src/`)
- All frontend source files (`packages/frontend/src/`)

### 🗑️ Cleaned
- Generated reports (`benchmark-report.md`, `score-results.json`)
- Build artifacts (`dist/` directories)
- Database files (`*.db`)
- Test results
- Security audit files

### ⏸️ Preserved
- `node_modules/` (no need to reinstall)
- Configuration files (package.json, tsconfig, etc.)
- Test files (tests are not buggy, only source code is)
- Database schema and seed files
- The `baseline/` directory itself

## When to Reset

### 1. Testing Multiple AI Agents
```bash
# Test Agent A
npm run benchmark
# ... agent fixes bugs ...
# Score: 75/100

# Reset for Agent B
npm run reset
npm run build:all
npm run benchmark
# Score: 36/100 (baseline restored)
```

### 2. Starting Fresh After Experiments
```bash
# You've been fixing bugs manually
npm run benchmark
# Score: 82/100

# Want to start over
npm run reset
npm run build:all
npm run benchmark
# Score: 36/100 (back to baseline)
```

### 3. Verifying Bug Fixes
```bash
# Fix a bug
vim packages/backend/src/routes/users.ts

# Test it
npm run build:backend
npm run test:security

# Reset to verify bug was actually there
npm run reset
npm run build:backend
npm run test:security  # Should fail again
```

## After Reset Workflow

```bash
# 1. Reset
npm run reset

# 2. Rebuild (required - dist/ was cleaned)
npm run build:all

# 3. Run benchmark
npm run benchmark

# 4. Verify baseline score
cat benchmark-report.md
# Should show ~36/100
```

## Verification Commands

Verify the buggy code was restored:

```bash
# Check hardcoded secrets (bug should exist)
grep "super-secret-key" packages/backend/src/config/secrets.ts
# Output: jwtSecret: 'super-secret-key-12345'

# Check SQL injection (bug should exist)
grep -n "LIKE '%\${query}%'" packages/backend/src/routes/users.ts
# Output: line 23 with SQL injection

# Check XSS vulnerability (bug should exist)
grep -n "dangerouslySetInnerHTML" packages/frontend/src/components/ProductList/ProductCard.tsx
# Output: line 18 with XSS vulnerability

# Check O(n²) sorting (bug should exist)
grep -A5 "sortProductsByPrice" packages/backend/src/services/productService.ts
# Output: bubble sort with nested loops
```

## Troubleshooting

### Score Not ~36/100 After Reset

```bash
# Ensure baseline has correct files
ls -la baseline/backend/src/config/secrets.ts
ls -la baseline/frontend/src/components/ProductList/ProductCard.tsx

# Re-run reset
npm run reset

# Clean everything and rebuild
rm -rf packages/*/dist packages/*/node_modules
npm install
npm run build:all
npm run benchmark
```

### Reset Script Not Working

```bash
# Make sure it's executable
chmod +x scripts/reset.sh

# Run with bash explicitly
bash scripts/reset.sh
```

### Modified Baseline by Accident

If you accidentally modified files in `baseline/`, restore from a clean copy:

```bash
# If you have git
git restore baseline/

# Or manually copy from packages/ (only if packages/ has original bugs)
rm -rf baseline/backend/src baseline/frontend/src
mkdir -p baseline/backend/src baseline/frontend/src
cp -r packages/backend/src/* baseline/backend/src/
cp -r packages/frontend/src/* baseline/frontend/src/
```

## Updating the Baseline

If you want to change the baseline bugs:

1. Modify the source files in `packages/backend/src` or `packages/frontend/src`
2. Update the baseline:
   ```bash
   rm -rf baseline/backend/src baseline/frontend/src
   mkdir -p baseline/backend/src baseline/frontend/src
   cp -r packages/backend/src/* baseline/backend/src/
   cp -r packages/frontend/src/* baseline/frontend/src/
   ```
3. Verify the new baseline:
   ```bash
   npm run reset
   npm run build:all
   npm run benchmark
   ```

## Safety Tips

- ⚠️ Always commit your work before resetting (if using git)
- ⚠️ The reset script asks for confirmation - read it!
- ⚠️ Don't modify files in `baseline/` directory
- ✅ The reset preserves `node_modules/` so it's fast
- ✅ The reset is safe - it only touches source files and generated artifacts
