# Baseline Files Inventory

This document lists all files stored in the baseline for reset functionality.

## Backend Source Files (15 files)

### Config
- `backend/src/config/database.ts` - Database connection with SQL injection vulnerability
- `backend/src/config/secrets.ts` - **Hardcoded secrets (JWT, API keys)**

### Middleware
- `backend/src/middleware/auth.ts` - **Missing authentication checks**
- `backend/src/middleware/validation.ts` - Weak validation
- `backend/src/middleware/errorHandler.ts` - Error handling

### Routes
- `backend/src/routes/products.ts` - **N+1 queries, missing auth on delete**
- `backend/src/routes/users.ts` - **SQL injection in search**
- `backend/src/routes/cart.ts` - **Race conditions**
- `backend/src/routes/checkout.ts` - Integer overflow potential

### Services
- `backend/src/services/productService.ts` - **O(n²) bubble sort, wrong discount logic**
- `backend/src/services/cartService.ts` - Cart management
- `backend/src/services/paymentService.ts` - **Missing error handling**

### Utils
- `backend/src/utils/helpers.ts` - **Code duplication**

### Main
- `backend/src/index.ts` - Express server entry point

## Frontend Source Files (16 files)

### Components - ProductList
- `frontend/src/components/ProductList/ProductList.tsx` - **Unnecessary re-renders**
- `frontend/src/components/ProductList/ProductList.css`
- `frontend/src/components/ProductList/ProductCard.tsx` - **XSS vulnerability**
- `frontend/src/components/ProductList/ProductCard.css`

### Components - Cart
- `frontend/src/components/Cart/Cart.tsx` - **Memory leak (interval)**
- `frontend/src/components/Cart/Cart.css`
- `frontend/src/components/Cart/CartItem.tsx` - **Off-by-one error**
- `frontend/src/components/Cart/CartItem.css`

### Components - Checkout
- `frontend/src/components/Checkout/Checkout.tsx` - Missing validation
- `frontend/src/components/Checkout/Checkout.css`

### Context
- `frontend/src/context/CartContext.tsx` - **God object anti-pattern**

### Hooks
- `frontend/src/hooks/useProducts.ts` - Product loading
- `frontend/src/hooks/useCart.ts` - **Memory leak (interval)**

### Main
- `frontend/src/App.tsx` - Root component
- `frontend/src/App.css`
- `frontend/src/main.tsx` - Entry point

## Total Files

- **Backend:** 15 source files
- **Frontend:** 16 source files
- **Total:** 31 source files with bugs

## Bug Distribution

| File | Bugs |
|------|------|
| `backend/src/config/secrets.ts` | 4 hardcoded secrets |
| `backend/src/routes/users.ts` | SQL injection |
| `backend/src/routes/products.ts` | N+1 query, missing auth |
| `backend/src/routes/cart.ts` | Race condition |
| `backend/src/services/productService.ts` | O(n²) sort, wrong logic |
| `backend/src/services/paymentService.ts` | Missing error handling |
| `backend/src/utils/helpers.ts` | Code duplication |
| `frontend/src/components/ProductList/ProductCard.tsx` | XSS |
| `frontend/src/components/ProductList/ProductList.tsx` | Re-renders |
| `frontend/src/components/Cart/Cart.tsx` | Memory leak |
| `frontend/src/components/Cart/CartItem.tsx` | Off-by-one |
| `frontend/src/context/CartContext.tsx` | God object |
| `frontend/src/hooks/useCart.ts` | Memory leak |

## Verification

After reset, run this to verify baseline is intact:

```bash
# Check for hardcoded secret (should exist)
grep "super-secret-key" packages/backend/src/config/secrets.ts

# Check for SQL injection (should exist)
grep "LIKE '%\${query}%'" packages/backend/src/routes/users.ts

# Check for XSS (should exist)
grep "dangerouslySetInnerHTML" packages/frontend/src/components/ProductList/ProductCard.tsx

# Run benchmark (should be ~36/100)
npm run build:all
npm run benchmark
```
