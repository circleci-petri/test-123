# Baseline - Original Buggy Source Files

This directory contains the **original source code with all bugs intact**. These files serve as the baseline for the benchmark.

## Purpose

When testing multiple AI coding agents or running repeated benchmark tests, you can reset the codebase back to its buggy state using the reset script.

## Contents

```
baseline/
├── backend/src/      # Backend source with all bugs
│   ├── config/       # Hardcoded secrets, SQL injection
│   ├── middleware/   # Missing auth checks
│   ├── routes/       # SQL injection, N+1 queries
│   ├── services/     # O(n²) sorting, wrong logic
│   └── utils/        # Code duplication
└── frontend/src/     # Frontend source with all bugs
    ├── components/   # XSS, memory leaks
    ├── context/      # God object anti-pattern
    └── hooks/        # Memory leaks, race conditions
```

## Using the Reset Script

To restore the codebase to its original buggy state:

```bash
./scripts/reset.sh
```

This will:
1. ✅ Restore all source files from `baseline/`
2. ✅ Clean generated files (reports, scores)
3. ✅ Clean build artifacts
4. ✅ Reset database
5. ✅ Clean test results

## What's NOT Included

The baseline **does not** include:
- `node_modules/` - Dependencies (run `npm install`)
- `dist/` - Build outputs (run `npm run build:all`)
- `database/` - Database files (auto-created on startup)
- Test results or reports
- Configuration files (package.json, tsconfig, etc.)

## Verification

After reset, the baseline score should be approximately **36/100**:
- Security: 5/100
- Performance: 88.75/100
- Code Quality: 25.80/100
- Logic: 37.46/100

Run the benchmark to verify:

```bash
npm run build:all
npm run benchmark
```

## Protection

⚠️ **Do NOT modify files in this directory!**

These files are the "source of truth" for the buggy baseline. If you need to change the baseline bugs, update the files in `packages/` first, then copy them here.

To update the baseline with new bugs:

```bash
# After modifying packages/backend/src or packages/frontend/src
rm -rf baseline/backend/src baseline/frontend/src
mkdir -p baseline/backend/src baseline/frontend/src
cp -r packages/backend/src/* baseline/backend/src/
cp -r packages/frontend/src/* baseline/frontend/src/
```
