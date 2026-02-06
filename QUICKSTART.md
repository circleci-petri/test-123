# Quick Start Guide

Get the Coding Agent Benchmark running in under 5 minutes.

## Prerequisites

- Node.js 20+
- npm 10+

## Installation

```bash
npm install
```

## Run the Benchmark

```bash
npm run benchmark
```

This will:
1. Build all packages
2. Run all tests
3. Calculate your score
4. Generate a report

## Reset to Baseline (Between Tests)

```bash
./scripts/reset.sh
```

Resets the codebase to original buggy state. Use this when:
- Testing multiple AI agents
- Starting a fresh benchmark run
- Accidentally fixed bugs and want to start over

## View Results

```bash
# Detailed report
cat benchmark-report.md

# Raw JSON data
cat score-results.json
```

## Expected Output

```
=== Coding Agent Benchmark ===

Step 1: Installing dependencies...
✓ Done

Step 2: Building packages...
✓ Backend built
✓ Frontend built
✓ Scoring built

Step 3: Running backend tests...
✗ Some tests failing (expected)

Step 4: Running frontend tests...
✗ Some tests failing (expected)

Step 5: Running security tests...
✗ Most tests failing (expected)

Step 6: Calculating score...
Final Score: 36.09/100

Step 7: Generating report...
✓ Report created

=== Benchmark Complete ===
Report: benchmark-report.md
Results: score-results.json
```

## Run Individual Test Suites

```bash
# Backend unit tests
npm run test:backend:unit

# Backend integration tests
npm run test:backend:integration

# Frontend unit tests
npm run test:frontend:unit

# E2E tests
npm run test:frontend:e2e

# Security tests
npm run test:security

# All tests
npm run test:all
```

## Run the Application

```bash
# Terminal 1: Start backend (http://localhost:3000)
npm run start:backend

# Terminal 2: Start frontend (http://localhost:5173)
npm run start:frontend

# Or both at once:
npm run start:all
```

## Test Credentials

**Default User:**
- Username: `alice`
- Password: `password123`

**Admin User:**
- Username: `admin`
- Password: `password123`

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Lock

```bash
# Remove database and reinitialize
rm packages/backend/database/app.db
npm run start:backend
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules packages/*/node_modules
npm install
```

## For AI Agents

### Workflow

1. **Discover Bugs**
   ```bash
   npm run test:all
   ```

2. **Analyze Failures**
   - Read test files to understand expected behavior
   - Read source files to find bugs

3. **Fix Bugs**
   - Edit source files
   - Make minimal changes

4. **Verify Fix**
   ```bash
   npm run test:backend:unit  # or specific test suite
   ```

5. **Check Progress**
   ```bash
   npm run score:calculate
   npm run score:report
   cat benchmark-report.md
   ```

6. **Repeat**
   - Continue until score improves

### Scoring

- **Baseline:** ~36/100 (all bugs present)
- **Good:** 50-70/100
- **Excellent:** 70-85/100
- **Near Perfect:** 86-98/100

### Tips

- Focus on high-weight categories first (Security 3.0x, Logic 2.5x)
- Fix failing tests before optimizing passing tests
- Don't break existing passing tests (regression penalty)
- Read test assertions to understand correct behavior

## Project Structure

```
test-123/
├── packages/
│   ├── backend/     # Express API (bugs here!)
│   ├── frontend/    # React app (bugs here too!)
│   └── scoring/     # Test collection + scoring
├── scripts/         # Helper scripts
└── .circleci/       # CI pipeline
```

## Help

- See `README.md` for full documentation
- See `BUGS.md` for bug inventory (maintainers only)
- See `IMPLEMENTATION_SUMMARY.md` for technical details

## License

MIT
