# Admin Panel - Product-Based API Flow

This document explains how the admin panel works with product-based API routing.

## Overview

After login, admins must select a product/category. Once selected, all API calls automatically use endpoints specific to that product. This ensures data isolation and proper routing.

## User Flow

### 1. Login
- Admin logs in at `/login`
- After successful login → Redirected to `/products`

### 2. Product Selection
- Admin sees all available products/categories
- Admin clicks on a product (e.g., Restaurant, LiveNotes, etc.)
- Product is stored in Zustand store (persisted to localStorage)
- Admin is redirected to `/product/{productSlug}/dashboard`

### 3. Using the Admin Panel
- All pages are now under `/product/{productSlug}/...`
- All API calls automatically include the product slug
- Example: `/api/v1/users` → `/api/v1/restaurant/users`
- All data shown is specific to the selected product

### 4. Switching Products
- Admin can switch products via:
  - Sidebar: "Switch Product" button
  - Topbar: Product badge with switch icon
  - User menu: "Switch Product" option
- Switching clears current product and redirects to `/products`

## API Routing

### Automatic Product Slug Injection

The API client (`src/api/client.ts`) automatically adds the product slug to all API requests:

```typescript
// Before: /api/v1/users
// After (if restaurant selected): /api/v1/restaurant/users

// Before: /api/v1/admin/dashboard
// After (if livenotes selected): /api/v1/livenotes/admin/dashboard
```

### Global Routes (Not Modified)

These routes are NOT modified by the product slug:
- `/products` - Product listing
- `/auth/*` - Authentication endpoints

### Product-Specific Routes

All other routes are automatically prefixed with the product slug:
- `/users` → `/restaurant/users`
- `/admin/dashboard` → `/restaurant/admin/dashboard`
- `/agents` → `/restaurant/agents`
- etc.

## Route Structure

### Product Routes
```
/product/:productSlug/dashboard
/product/:productSlug/users
/product/:productSlug/agents
/product/:productSlug/customer
/product/:productSlug/support
/product/:productSlug/property
/product/:productSlug/analytics
/product/:productSlug/orders
/product/:productSlug/transaction
/product/:productSlug/discover
/product/:productSlug/inbox
/product/:productSlug/calendar
/product/:productSlug/auction-requests
/product/:productSlug/submit-auction
```

### Global Routes
```
/products          - Product selection page
/login             - Login page
/settings          - Settings (global)
```

## Components Updated

### 1. ProtectedRoute
- Checks if product is selected
- Redirects to `/products` if no product selected
- Allows access to product routes if product is selected

### 2. AppLayout
- Requires product selection before rendering
- Redirects to `/products` if no product selected

### 3. Sidebar
- Shows selected product name
- All navigation links use product-specific routes
- Includes "Switch Product" button

### 4. Topbar
- Shows selected product badge
- Includes "Switch Product" option in user menu
- Clears product on logout

### 5. API Client
- Automatically injects product slug into API URLs
- Skips global routes
- Works transparently for all API calls

## Product Store

The product store (`src/store/product.ts`) manages the selected product:

```typescript
interface ProductState {
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
  clearSelectedProduct: () => void
}
```

The store persists to localStorage, so the selected product survives page refreshes.

## Example API Calls

### Without Product Selected
```typescript
// This would fail or redirect to product selection
api.get('/users')  // Not allowed
```

### With Restaurant Selected
```typescript
// Automatically becomes:
api.get('/users')  // → GET /api/v1/restaurant/users
api.get('/admin/dashboard')  // → GET /api/v1/restaurant/admin/dashboard
api.post('/agents', data)  // → POST /api/v1/restaurant/agents
```

### With LiveNotes Selected
```typescript
// Automatically becomes:
api.get('/users')  // → GET /api/v1/livenotes/users
api.get('/admin/dashboard')  // → GET /api/v1/livenotes/admin/dashboard
```

## Benefits

1. **Data Isolation**: Each product's data is completely separate
2. **Automatic Routing**: No need to manually add product slug to every API call
3. **Type Safety**: TypeScript ensures proper usage
4. **User Experience**: Clear indication of which product is active
5. **Easy Switching**: One-click product switching

## Testing

1. Login as admin
2. You should be redirected to `/products`
3. Select a product (e.g., Restaurant)
4. Check browser DevTools → Network tab
5. All API calls should include `/restaurant/` in the URL
6. Try switching products - API calls should update accordingly

## Notes

- Product selection is required before accessing any admin pages
- Product selection persists across page refreshes
- Logging out clears the product selection
- Each product has its own database and API endpoints
- All API calls are automatically scoped to the selected product
