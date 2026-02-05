# Product Structure with Modules

Each product now has all related modules in its own folder. This makes each product completely self-contained.

## Structure

```
products/
├── restaurant/
│   ├── modules/                    # All product modules
│   │   ├── auth/                   # Authentication module
│   │   │   ├── controllers/
│   │   │   │   └── authController.ts
│   │   │   ├── models/
│   │   │   │   └── User.ts
│   │   │   ├── routes/
│   │   │   │   └── authRoutes.ts
│   │   │   └── index.ts
│   │   ├── user/                   # User management module
│   │   ├── admin/                  # Admin management module
│   │   ├── agent/                  # Agent management module
│   │   ├── property/               # Property management module
│   │   ├── support/                # Support tickets module
│   │   ├── payment/               # Payment module
│   │   ├── auction/               # Auction module
│   │   └── orders/                # Product-specific module (restaurant orders)
│   ├── controllers/                # Product-level controllers
│   │   └── dashboardController.ts
│   ├── routes/
│   │   └── index.ts               # Main routes (imports all modules)
│   └── index.ts                    # Main export
├── livenotes/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── admin/
│   │   ├── notes/                 # Product-specific module
│   │   └── ...
│   └── ...
└── ...
```

## Using Product Database Connection

All modules use the product's database connection. Example:

```typescript
// In any controller
export const someController = async (req: Request, res: Response, next: NextFunction) => {
  const productConnection = (req as any).productConnection
  
  // Get User model using product connection
  const User = getUserModel(productConnection)
  
  // Query product database
  const users = await User.find()
  
  res.json({ status: 'success', data: { users } })
}
```

## Module Organization

Each module is self-contained:
- **controllers/**: Business logic
- **models/**: Database schemas (export `get{Model}Model(connection)` functions)
- **routes/**: API routes
- **index.ts**: Module exports

## Routes Organization

Main routes file (`routes/index.ts`) imports and registers all modules:

```typescript
import { default as authRoutes } from '../modules/auth/routes/authRoutes.js'
import { default as userRoutes } from '../modules/user/routes/userRoutes.js'
import { default as adminRoutes } from '../modules/admin/routes/adminRoutes.js'

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/admin', adminRoutes)
```

## API Endpoints

With this structure, your API endpoints are:
- `/api/v1/restaurant/auth/login` → `restaurant/modules/auth/routes/authRoutes.ts`
- `/api/v1/restaurant/user/profile` → `restaurant/modules/user/routes/userRoutes.ts`
- `/api/v1/restaurant/admin/dashboard` → `restaurant/modules/admin/routes/adminRoutes.ts`
- `/api/v1/restaurant/orders` → `restaurant/modules/orders/routes/orderRoutes.ts`

Each product has its own complete set of modules!
