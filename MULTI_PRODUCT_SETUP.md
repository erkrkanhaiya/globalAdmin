# Multi-Product Admin System

This system supports multiple products (Restaurant, LiveNotes, RentalCabBooking, WhatsApp API, CRM, etc.) in a single codebase with separate databases for each product.

## Architecture

### Backend Structure

1. **Main Database** (`product`): Stores product definitions and admin users
2. **Product Databases**: Each product has its own database:
   - `restaurant_db` - Restaurant Management
   - `livenotes_db` - Live Notes
   - `rentalcabbooking_db` - Rental Cab Booking
   - `whatsappapi_db` - WhatsApp API
   - `crm_db` - CRM

### API Routes

#### Product Management
- `GET /api/v1/products` - Get all products (for category selection)
- `GET /api/v1/products/:slug` - Get single product
- `POST /api/v1/products` - Create product (Admin only)
- `PUT /api/v1/products/:id` - Update product (Admin only)

#### Product-Specific Routes
Each product has its own API endpoints:
- `POST /api/v1/restaurant/login` - Restaurant login
- `GET /api/v1/restaurant/dashboard` - Restaurant dashboard
- `POST /api/v1/livenotes/login` - LiveNotes login
- `GET /api/v1/livenotes/dashboard` - LiveNotes dashboard
- And so on...

### Frontend Flow

1. **Login** → `/login`
2. **Product Selection** → `/products` (shows all available products)
3. **Product Dashboard** → `/product/:productSlug/dashboard` (product-specific dashboard)

## Setup Instructions

### 1. Seed Products

```bash
cd server
npm run seed:products
```

This creates 5 products:
- Restaurant
- LiveNotes
- Rental Cab Booking
- WhatsApp API
- CRM

### 2. Add a New Product

#### Backend

1. Create product route file:
```typescript
// server/src/modules/yourproduct/routes/yourproductRoutes.ts
import { Router } from 'express'
import { protect } from '../../../middleware/auth.js'

const router = Router()
router.use(protect)

router.post('/login', async (req, res, next) => {
  const product = (req as any).product
  // Your login logic here
})

export default router
```

2. Register in `server/src/routes/index.ts`:
```typescript
import yourproductRoutes from '../modules/yourproduct/routes/yourproductRoutes.js'

// In the switch statement:
case 'yourproduct':
  return yourproductRoutes(req, res, next)
```

3. Add product to seed script or create manually via API:
```bash
POST /api/v1/products
{
  "name": "Your Product",
  "slug": "yourproduct",
  "displayName": "Your Product Display Name",
  "description": "Description",
  "icon": "🎯",
  "color": "#6366f1",
  "databaseName": "yourproduct_db"
}
```

#### Frontend

1. Create product dashboard page (optional):
```typescript
// src/pages/YourProductDashboardPage.tsx
export default function YourProductDashboardPage() {
  // Your product-specific UI
}
```

2. Add route in `src/App.tsx`:
```typescript
<Route path="/product/yourproduct/dashboard" element={<YourProductDashboardPage />} />
```

## Database Connections

The system uses a connection manager (`multiDatabase.ts`) that:
- Creates separate MongoDB connections for each product
- Caches connections for performance
- Automatically handles reconnection

Each product's models should use the product connection:
```typescript
import { getProductConnection } from '../config/multiDatabase.js'

// In your controller
const productConnection = (req as any).productConnection
const User = productConnection.model('User', UserSchema)
```

## Adding Product-Specific Models

1. Create model file in product module:
```typescript
// server/src/modules/restaurant/models/Order.ts
import { Schema, model } from 'mongoose'

const OrderSchema = new Schema({
  // Your schema
})

export const Order = model('Order', OrderSchema)
```

2. Use in controller with product connection:
```typescript
import { getProductConnection } from '../../../config/multiDatabase.js'

// In route handler
const productConnection = (req as any).productConnection
const Order = productConnection.model('Order', OrderSchema)
```

## Mobile API Endpoints

Mobile apps can access product-specific APIs:
- `POST http://localhost:5001/api/v1/restaurant/login`
- `POST http://localhost:5001/api/v1/livenotes/login`
- `GET http://localhost:5001/api/v1/restaurant/dashboard`
- etc.

All endpoints require:
1. **Basic Auth** (for public endpoints like login): `Authorization: Basic base64(API_KEY:API_SECRET)`
2. **Bearer Token** (for protected endpoints): `Authorization: Bearer <JWT_TOKEN>`

## Current Products

| Product | Slug | Database | API Base |
|---------|------|----------|----------|
| Restaurant | `restaurant` | `restaurant_db` | `/api/v1/restaurant` |
| LiveNotes | `livenotes` | `livenotes_db` | `/api/v1/livenotes` |
| Rental Cab Booking | `rentalcabbooking` | `rentalcabbooking_db` | `/api/v1/rentalcabbooking` |
| WhatsApp API | `whatsappapi` | `whatsappapi_db` | `/api/v1/whatsappapi` |
| CRM | `crm` | `crm_db` | `/api/v1/crm` |

## Next Steps

1. **Implement product-specific features**: Add models, controllers, and routes for each product
2. **Create product dashboards**: Build UI for each product's admin panel
3. **Add authentication**: Implement product-specific user authentication
4. **Separate databases**: When ready, move each product to its own codebase

## Notes

- All products share the same admin authentication
- Each product has its own database for data isolation
- Product routes are dynamically routed based on slug
- The system is designed to be easily split into separate services later
