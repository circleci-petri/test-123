# Coding Agent Benchmark Application

An e-commerce application intentionally seeded with bugs across security, performance, code quality, and logic domains. Designed to benchmark AI coding agents' ability to identify and fix real-world issues.

## 🎯 Purpose

This application serves as a comprehensive benchmark for evaluating AI coding agents. It contains **50+ deliberately seeded bugs** that agents must identify and fix. Automated scoring via CircleCI provides objective performance metrics.

## 📊 Scoring System

**Total Score = (Security × 3.0) + (Performance × 2.0) + (Code Quality × 1.5) + (Logic × 2.5) / 9.0**

- **Baseline Score:** ~36/100 (with all bugs present)
- **Perfect Score:** ~98/100 (with all bugs fixed)
- **Regression Penalty:** -5 points per broken test

### Score Categories

| Category | Weight | Description |
|----------|--------|-------------|
| **Security** | 3.0x | SQL injection, XSS, hardcoded secrets, missing auth |
| **Performance** | 2.0x | N+1 queries, memory leaks, inefficient algorithms |
| **Code Quality** | 1.5x | Duplication, error handling, type safety |
| **Logic** | 2.5x | Off-by-one errors, race conditions, edge cases |

## 🏗️ Architecture

### Monorepo Structure

```
test-123/
├── packages/
│   ├── backend/          # Express + TypeScript + SQLite
│   ├── frontend/         # Vite + React + TypeScript
│   └── scoring/          # Test collection + scoring logic
├── baseline/             # Original buggy source files (for reset)
├── .circleci/
│   └── config.yml        # CI pipeline for automated scoring
└── scripts/
    ├── setup.sh
    ├── run-benchmark.sh
    └── reset.sh          # Reset to baseline
```

### Technology Stack

**Backend:**
- Express.js 4.18+
- TypeScript 5.0+
- SQLite3 (no ORM - enables SQL injection vulnerabilities)
- JWT authentication

**Frontend:**
- Vite 5.0+
- React 18+
- React Router 6+
- CSS Modules

**Testing:**
- Jest + Supertest (backend)
- Vitest + React Testing Library (frontend)
- Playwright (E2E)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd test-123

# Run setup script
npm run setup

# Or manually:
npm install
npm run build:all
```

### Running the Application

```bash
# Start backend (port 3000)
npm run start:backend

# Start frontend (port 5173)
npm run start:frontend

# Start both concurrently
npm run start:all
```

### Running Tests

```bash
# All tests
npm run test:all

# Backend only
npm run test:backend:unit
npm run test:backend:integration

# Frontend only
npm run test:frontend:unit
npm run test:frontend:e2e

# Security tests
npm run test:security
```

### Running the Benchmark

```bash
# Full benchmark with scoring
npm run benchmark

# Or manually:
npm run score:calculate  # Generate score-results.json
npm run score:report     # Generate benchmark-report.md
```

### Resetting to Baseline (Between Tests)

After an AI agent has fixed bugs, reset the codebase back to its original buggy state:

```bash
./scripts/reset.sh
```

This will:
- ✅ Restore all source files to original buggy state
- ✅ Clean generated reports and scores
- ✅ Remove build artifacts
- ✅ Reset database
- ✅ Clean test results

**Use case:** Testing multiple AI agents or running repeated benchmarks. Each agent should start with the same baseline bugs.

The original buggy source code is preserved in `baseline/` directory. See `baseline/README.md` for details.

## 🐛 Bug Categories

### Security Vulnerabilities (17 bugs)

**SQL Injection (5 bugs)**
- Location: `packages/backend/src/routes/users.ts:23`
- Direct string interpolation in query
- Example: `SELECT * FROM users WHERE username LIKE '%${query}%'`

**Hardcoded Secrets (4 bugs)**
- Location: `packages/backend/src/config/secrets.ts`
- JWT secret, API keys, database URLs in source code

**XSS (3 bugs)**
- Location: `packages/frontend/src/components/ProductList/ProductCard.tsx:18`
- `dangerouslySetInnerHTML` without sanitization

**Missing Authentication (3 bugs)**
- Location: `packages/backend/src/routes/products.ts:57`
- Admin-only delete endpoint with no auth check

**Weak Validation (2 bugs)**
- Email validation only checks for '@'
- No password strength requirements

### Performance Issues (12 bugs)

**N+1 Queries (3 bugs)**
- Location: `packages/backend/src/routes/products.ts:12-16`
- Loading reviews separately for each product

**Memory Leaks (4 bugs)**
- Location: `packages/frontend/src/components/Cart/Cart.tsx:9-12`
- `setInterval` without cleanup in `useEffect`
- Location: `packages/frontend/src/hooks/useCart.ts:14-19`
- Another interval without cleanup

**Inefficient Algorithm (2 bugs)**
- Location: `packages/backend/src/services/productService.ts:24-32`
- O(n²) bubble sort instead of native sort
- Creates unnecessary copies

**Unnecessary Re-renders (3 bugs)**
- Location: `packages/frontend/src/components/ProductList/ProductList.tsx:13`
- New object created every render causing child re-renders

### Code Quality Problems (13 bugs)

**Code Duplication (5 bugs)**
- Location: `packages/backend/src/utils/helpers.ts:1-29`
- Repeated formatting logic
- Duplicated total calculation

**Missing Error Handling (3 bugs)**
- Location: `packages/backend/src/services/paymentService.ts:1-9`
- No try-catch, no status code checks

**God Object (2 bugs)**
- Location: `packages/frontend/src/context/CartContext.tsx`
- Cart, user, products, notifications all in one context

**Excessive `any` Usage (20+ instances)**
- Throughout codebase
- `Product.price: any` should be `number`

**Poor Naming (3 bugs)**
- Generic names like `data`, `result`, `tmp`

### Logic Bugs (10 bugs)

**Off-by-One Errors (3 bugs)**
- Location: `packages/backend/src/routes/products.ts:30`
- `offset = page * 10` should be `(page - 1) * 10`
- Location: `packages/frontend/src/components/Cart/CartItem.tsx:17-19`
- Decrement allows negative quantities

**Race Conditions (2 bugs)**
- Location: `packages/backend/src/routes/cart.ts:23-28`
- Concurrent cart additions read same quantity

**Wrong Conditionals (2 bugs)**
- Location: `packages/backend/src/services/productService.ts:34-38`
- `user.isPremium || product.price > 100` should be `&&`

**Edge Case Bugs (3 bugs)**
- Empty cart handling
- Zero quantity handling
- Missing null checks

## 📝 Test Infrastructure

### Test Organization

```
packages/backend/tests/
├── unit/                    # Fast, isolated tests
│   ├── productService.test.ts
│   └── cartService.test.ts
├── integration/             # API endpoint tests
│   ├── products.test.ts
│   └── cart.test.ts
└── security/                # Security-specific tests
    ├── sql-injection.test.ts
    └── auth.test.ts

packages/frontend/tests/
├── unit/                    # Component tests
│   ├── CartItem.test.tsx
│   └── ProductCard.test.tsx
└── e2e/                     # End-to-end flows
    └── shopping-flow.spec.ts
```

### Example: Failing Performance Test

```typescript
describe('sortProductsByPrice', () => {
  it('should sort efficiently', () => {
    const products = generateProducts(1000);
    const start = performance.now();
    const sorted = sortProductsByPrice(products);
    const duration = performance.now() - start;

    expect(duration).toBeLessThan(100); // FAILS with O(n²)
  });
});
```

## 🔄 CircleCI Pipeline

The `.circleci/config.yml` defines a workflow that:

1. **Setup** - Install dependencies
2. **Run Backend Tests** - Unit + Integration
3. **Run Frontend Tests** - Unit + E2E
4. **Run Security Scan** - SQL injection, XSS, secrets
5. **Run Performance Tests** - Response times, bundle size
6. **Calculate Score** - Apply scoring formula
7. **Generate Report** - Create markdown report

View results in CircleCI artifacts:
- `benchmark-report.md` - Human-readable report
- `score-results.json` - Raw scoring data

## 🎓 Using as a Benchmark

### For AI Agents

1. Read the codebase and tests
2. Identify failing tests
3. Fix bugs to make tests pass
4. Run `npm run benchmark` to get score
5. Iterate until score improves

### Expected Agent Workflow

```bash
# 1. Discover failing tests
npm run test:all

# 2. Analyze specific failures
npm run test:backend:unit -- productService.test.ts

# 3. Fix the bug
# Edit packages/backend/src/services/productService.ts

# 4. Verify fix
npm run test:backend:unit -- productService.test.ts

# 5. Check overall progress
npm run score:calculate
npm run score:report
```

### Scoring Interpretation

| Score Range | Interpretation |
|-------------|----------------|
| 0-35 | Baseline (bugs present) |
| 36-50 | Early progress, major issues remain |
| 51-70 | Good progress, important bugs fixed |
| 71-85 | Very good, most bugs fixed |
| 86-98 | Excellent, nearly complete |
| 99-100 | Perfect (virtually impossible) |

## 🔧 Development

### Adding New Tests

```bash
# Backend unit test
touch packages/backend/tests/unit/newFeature.test.ts

# Frontend component test
touch packages/frontend/tests/unit/NewComponent.test.tsx

# Security test
touch packages/backend/tests/security/new-vulnerability.test.ts
```

### Modifying Scoring

Edit `packages/scoring/src/scoring/calculator.ts` to adjust:
- Category weights
- Scoring formulas
- Regression penalties

### Updating Scoring Baseline Metrics

To update the expected baseline metrics for scoring (not the source code baseline):

```bash
npm run score:baseline
# Copy output to packages/scoring/baseline/metrics.json
```

### Updating Source Code Baseline

To update the original buggy source files in `baseline/`:

```bash
# 1. Modify source files in packages/backend/src or packages/frontend/src
# 2. Update baseline snapshot:
rm -rf baseline/backend/src baseline/frontend/src
mkdir -p baseline/backend/src baseline/frontend/src
cp -r packages/backend/src/* baseline/backend/src/
cp -r packages/frontend/src/* baseline/frontend/src/

# 3. Verify:
npm run reset
npm run build:all
npm run benchmark
```

See `RESET_GUIDE.md` for more details.

## 📚 API Documentation

### Backend Endpoints

**Products**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (requires auth)
- `DELETE /api/products/:id` - Delete product (BUG: no auth!)

**Users**
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `GET /api/users/search?query=` - Search users (BUG: SQL injection!)

**Cart**
- `GET /api/cart` - Get user's cart (requires auth)
- `POST /api/cart/add` - Add item to cart (requires auth)
- `PUT /api/cart/update` - Update item quantity (requires auth)
- `DELETE /api/cart/remove/:productId` - Remove item (requires auth)

**Checkout**
- `POST /api/checkout` - Complete purchase (requires auth)

## 🤝 Contributing

This is a benchmark application with intentional bugs. If you want to contribute:

1. Add new bug categories
2. Improve test coverage
3. Enhance scoring logic
4. Add more performance benchmarks

Do NOT fix the bugs in the main branch - they're intentional!

## 📄 License

MIT

## 🙏 Acknowledgments

Designed to test AI coding agents on realistic bug patterns found in production codebases.
