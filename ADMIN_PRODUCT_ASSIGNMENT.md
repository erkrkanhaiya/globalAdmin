# Admin Product Assignment System

This document explains how admin users are assigned to specific products/categories.

## Overview

Each admin user can be assigned to specific products. When an admin logs in, they only see and can access their assigned products.

## User Roles and Product Access

### Super Admin
- **Role**: `super_admin`
- **assignedProducts**: `[]` (empty array) or `null`
- **Access**: All products
- **Can**: Create other admins, assign products to admins

### Regular Admin
- **Role**: `admin`, `subadmin_support`, `subadmin_agent`, etc.
- **assignedProducts**: Array of product slugs (e.g., `['restaurant', 'livenotes']`)
- **Access**: Only assigned products
- **Cannot**: Create admins or change product assignments

## User Model

The User model includes an `assignedProducts` field:

```typescript
interface IUser {
  // ... other fields
  assignedProducts?: string[] // Product slugs this admin can access
  // Empty array or null = access to all products (super admin)
  // Array with slugs = access only to those products
}
```

## API Endpoints

### Get Products (Filtered by Admin's Access)
```
GET /api/v1/products
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "products": [...], // Only products admin can access
    "accessInfo": {
      "hasAllAccess": false,
      "assignedProducts": ["restaurant", "livenotes"]
    }
  }
}
```

### Create Admin (Super Admin only)
```
POST /api/v1/admin/admins
```

**Request Body:**
```json
{
  "name": "Restaurant Admin",
  "email": "restaurant@admin.com",
  "password": "password123",
  "role": "admin",
  "assignedProducts": ["restaurant"]
}
```

### Update Admin's Product Assignments (Super Admin only)
```
PATCH /api/v1/admin/users/:id/products
```

**Request Body:**
```json
{
  "assignedProducts": ["restaurant", "livenotes"]
}
```

## Seeding Admins

Run the seed script to create example admin users:

```bash
npm run seed:admins
```

This creates:
- **Super Admin**: Access to all products
- **Restaurant Admin**: Only restaurant product
- **LiveNotes Admin**: Only livenotes product
- **RentalCab Admin**: Only rentalcabbooking product
- **WhatsAppAPI Admin**: Only whatsappapi product
- **CRM Admin**: Only crm product
- **Multi Product Admin**: Access to restaurant and livenotes

## Login Flow

1. Admin logs in with email/password
2. Server checks user's `assignedProducts`
3. Login response includes `assignedProducts` in user object
4. Frontend stores this in auth store
5. Product selection page shows only assigned products
6. Admin can only select from their assigned products

## Frontend Integration

### Auth Store
The auth store now includes `assignedProducts`:

```typescript
type AuthUser = {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  assignedProducts?: string[] // Products this admin can access
}
```

### Product Selection
The product selection page automatically filters products based on admin's `assignedProducts`:
- If `assignedProducts` is empty/null → Shows all products (super admin)
- If `assignedProducts` has values → Shows only those products

## Creating Admins via API

### Example: Create Restaurant Admin

```bash
curl -X POST http://localhost:5001/api/v1/admin/admins \
  -H "Authorization: Bearer <super_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restaurant Admin",
    "email": "restaurant@admin.com",
    "password": "password123",
    "role": "admin",
    "assignedProducts": ["restaurant"]
  }'
```

### Example: Update Admin's Products

```bash
curl -X PATCH http://localhost:5001/api/v1/admin/users/:id/products \
  -H "Authorization: Bearer <super_admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "assignedProducts": ["restaurant", "livenotes"]
  }'
```

## Product-Specific Admins

Each product has its own database, so admins assigned to a product will:
- Only see data from that product's database
- Only access API endpoints for that product
- Only see products they're assigned to in the product selection page

## Security

- Only `super_admin` can create admins
- Only `super_admin` can update product assignments
- Regular admins cannot see or access products they're not assigned to
- Product filtering happens at both API and frontend level

## Testing

1. **Seed admins**: `npm run seed:admins`
2. **Login as Restaurant Admin**: `restaurant@admin.com` / `restaurant123`
3. **Verify**: Only restaurant product is shown
4. **Login as Super Admin**: `superadmin@example.com` / `superadmin123`
5. **Verify**: All products are shown

## Notes

- `assignedProducts` is an array of product slugs (e.g., `['restaurant', 'livenotes']`)
- Empty array `[]` or `null` means access to all products (super admin behavior)
- Product assignments are stored in the main database (not product-specific databases)
- When an admin logs in, their assigned products are included in the JWT payload (via login response)
- Frontend uses `assignedProducts` to filter the product selection page
