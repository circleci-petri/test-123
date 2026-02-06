# Bug Inventory - Internal Reference

This document tracks all intentionally seeded bugs for maintainers. **Do NOT share with AI agents being tested.**

## Security Vulnerabilities

### SQL Injection

1. **User Search - Direct String Interpolation**
   - File: `packages/backend/src/routes/users.ts:23`
   - Code: `` `SELECT * FROM users WHERE username LIKE '%${query}%'` ``
   - Fix: Use parameterized queries with `?` placeholders
   - Test: `packages/backend/tests/security/sql-injection.test.ts`

### Hardcoded Secrets

2. **JWT Secret**
   - File: `packages/backend/src/config/secrets.ts:2`
   - Code: `jwtSecret: 'super-secret-key-12345'`
   - Fix: Use `process.env.JWT_SECRET`
   - Test: `packages/backend/tests/security/auth.test.ts:31`

3. **API Keys**
   - File: `packages/backend/src/config/secrets.ts:3-4`
   - Code: `apiKey: 'sk_live_abc123xyz789'`, `stripeSecret: 'sk_test_...'`
   - Fix: Use environment variables
   - Test: `packages/backend/tests/security/auth.test.ts:37`

### XSS Vulnerabilities

4. **Product Name Rendering**
   - File: `packages/frontend/src/components/ProductList/ProductCard.tsx:18`
   - Code: `<h3 dangerouslySetInnerHTML={{ __html: product.name }} />`
   - Fix: Use `{product.name}` directly or sanitize with DOMPurify
   - Test: `packages/frontend/tests/unit/ProductCard.test.tsx:19`

### Missing Authentication

5. **Product Deletion Endpoint**
   - File: `packages/backend/src/routes/products.ts:57`
   - Code: `router.delete('/:id', async (req, res) => {` (no middleware)
   - Fix: Add `requireAdmin` middleware
   - Test: `packages/backend/tests/security/auth.test.ts:21`

### Weak Validation

6. **Email Validation**
   - File: `packages/backend/src/utils/helpers.ts:32`
   - Code: `return email.includes('@')`
   - Fix: Use proper regex or validator library
   - Test: Should add validation test

## Performance Issues

### N+1 Query Problems

7. **Product Reviews Loading**
   - File: `packages/backend/src/routes/products.ts:12-16`
   - Code: Loop with `await query` for each product
   - Fix: Use JOIN or `WHERE product_id IN (?)`
   - Test: Performance test should measure query count

### Memory Leaks

8. **Cart Component Interval**
   - File: `packages/frontend/src/components/Cart/Cart.tsx:9-12`
   - Code: `setInterval` without cleanup
   - Fix: Return cleanup function in useEffect
   - Test: Memory profiler test

9. **useCart Hook Interval**
   - File: `packages/frontend/src/hooks/useCart.ts:14-19`
   - Code: Another interval leak
   - Fix: Return cleanup function
   - Test: Memory profiler test

### Inefficient Algorithms

10. **Bubble Sort for Products**
    - File: `packages/backend/src/services/productService.ts:24-32`
    - Code: O(n²) nested loops
    - Fix: Use `products.sort((a, b) => a.price - b.price)`
    - Test: `packages/backend/tests/unit/productService.test.ts:17`

### Unnecessary Re-renders

11. **ProductList Filters Object**
    - File: `packages/frontend/src/components/ProductList/ProductList.tsx:13`
    - Code: `const filters = { minPrice: 0, maxPrice: 1000 }` in render
    - Fix: Move outside component or useMemo
    - Test: React DevTools profiler test

## Code Quality Issues

### Code Duplication

12-16. **Format Functions**
    - File: `packages/backend/src/utils/helpers.ts:1-25`
    - Code: `formatUserForAPI`, `formatProductForAPI`, `formatOrderForAPI`
    - Fix: Create generic `formatForAPI(item, mapping)` function
    - Test: Code coverage test

17-18. **Calculate Total Functions**
    - File: `packages/backend/src/utils/helpers.ts:27-37`
    - Code: `calculateTotalPrice` and `calculateDiscountedTotal` duplicate loop
    - Fix: Single function with optional discount parameter
    - Test: Unit test

### Missing Error Handling

19. **Payment Service Fetch**
    - File: `packages/backend/src/services/paymentService.ts:1-9`
    - Code: No try-catch, no `response.ok` check
    - Fix: Wrap in try-catch, check `response.ok`, handle errors
    - Test: Integration test with mocked failures

20. **Payment Refund**
    - File: `packages/backend/src/services/paymentService.ts:11-16`
    - Code: Same issue as above
    - Fix: Same as above
    - Test: Integration test

### God Object

21. **CartContext Complexity**
    - File: `packages/frontend/src/context/CartContext.tsx`
    - Issue: Cart, user, products, notifications all in one context
    - Fix: Split into UserContext, CartContext, NotificationContext
    - Test: Architecture/design review

### Excessive any Usage

22-40. **Type Safety Issues**
    - Locations throughout codebase
    - Examples:
      - `packages/backend/src/services/productService.ts:8` - `price: any`
      - `packages/backend/src/utils/helpers.ts:39` - `sanitizeInput(input: any)`
      - Multiple function parameters typed as `any`
    - Fix: Replace with proper types
    - Test: TypeScript compiler errors

## Logic Bugs

### Off-by-One Errors

41. **Pagination Offset**
    - File: `packages/backend/src/routes/products.ts:30`
    - Code: `const offset = page * 10`
    - Fix: `const offset = (page - 1) * 10`
    - Test: `packages/backend/tests/integration/products.test.ts:21`

42. **Cart Item Quantity Decrease**
    - File: `packages/frontend/src/components/Cart/CartItem.tsx:17-19`
    - Code: Allows `quantity - 1` to go negative
    - Fix: Check if quantity > 0 before decreasing
    - Test: `packages/frontend/tests/unit/CartItem.test.tsx:23`

### Race Conditions

43. **Cart Addition Concurrency**
    - File: `packages/backend/src/routes/cart.ts:23-28`
    - Code: Read-then-write without locking
    - Fix: Use database transaction or atomic increment
    - Test: `packages/backend/tests/integration/cart.test.ts:19`

### Wrong Conditionals

44. **Discount Logic**
    - File: `packages/backend/src/services/productService.ts:34-38`
    - Code: `if (user?.isPremium || product.price > 100)`
    - Fix: Should be `&&` not `||`
    - Test: `packages/backend/tests/unit/productService.test.ts:29`

### Edge Cases

45. **Empty Cart Total**
    - File: `packages/backend/src/services/cartService.ts:48-51`
    - Issue: Works but could be more explicit
    - Fix: Add explicit empty check
    - Test: `packages/backend/tests/unit/cartService.test.ts:15`

46. **Missing Product in Cart Item**
    - File: `packages/backend/src/services/cartService.ts:48-51`
    - Issue: Doesn't handle `product: undefined`
    - Fix: Add null check
    - Test: `packages/backend/tests/unit/cartService.test.ts:21`

## Bug Summary

| Category | Count | Fixed in Baseline |
|----------|-------|-------------------|
| Security | 6 | 0 |
| Performance | 5 | 0 |
| Code Quality | 20+ | 0 |
| Logic | 10 | 0 |
| **Total** | **40+** | **0** |

## Expected Test Results

### Baseline (All Bugs Present)
- Security Tests: 2/23 passing (9%)
- Performance Tests: 0/4 passing (0%)
- Quality Metrics: High error counts
- Logic Tests: 6/16 passing (38%)
- **Overall Score: ~36/100**

### After All Fixes
- Security Tests: 23/23 passing (100%)
- Performance Tests: 4/4 passing (100%)
- Quality Metrics: Low error counts
- Logic Tests: 16/16 passing (100%)
- **Overall Score: ~98/100**
