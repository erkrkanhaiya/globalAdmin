# Products Directory Structure

This directory contains all product-specific code. Each product has its own folder with a complete structure including modules, controllers, models, routes, services, etc.

## Structure

```
products/
├── restaurant/
│   ├── modules/              # Product-specific modules
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   ├── orders/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   └── menu/             # Example: Menu module
│   │       ├── controllers/
│   │       ├── models/
│   │       ├── routes/
│   │       └── index.ts
│   ├── controllers/          # Product-level controllers (dashboard, etc.)
│   ├── models/               # Product-level models (if any)
│   ├── routes/
│   │   └── index.ts          # Main routes file (imports all modules)
│   ├── services/             # Product-level services
│   └── index.ts              # Main export
├── livenotes/
│   ├── modules/
│   │   ├── auth/
│   │   ├── notes/
│   │   └── collaborations/
│   ├── controllers/
│   ├── routes/
│   └── index.ts
└── ...
```

## Module Structure

Each module within a product follows this structure:

```
modules/
└── {moduleName}/
    ├── controllers/
    │   └── {moduleName}Controller.ts
    ├── models/
    │   └── {Model}.ts
    ├── routes/
    │   └── {moduleName}Routes.ts
    ├── services/             # Optional
    │   └── {moduleName}Service.ts
    ├── middleware/           # Optional
    │   └── validate{Module}.ts
    └── index.ts             # Module exports
```

## Adding a New Product

1. Create product folder structure:
```bash
mkdir -p src/products/yourproduct/{modules,controllers,models,routes,services}
```

2. Create a module (e.g., auth):
```bash
mkdir -p src/products/yourproduct/modules/auth/{controllers,routes}
```

3. Create module files:
```typescript
// src/products/yourproduct/modules/auth/controllers/authController.ts
export const login = async (req, res, next) => {
  // Your logic
}

// src/products/yourproduct/modules/auth/routes/authRoutes.ts
import { Router } from 'express'
import { login } from '../controllers/authController.js'

const router = Router()
router.post('/login', login)
export default router

// src/products/yourproduct/modules/auth/index.ts
export { default as authRoutes } from './routes/authRoutes.js'
export * from './controllers/authController.js'
```

4. Register module in main routes:
```typescript
// src/products/yourproduct/routes/index.ts
import { authRoutes } from '../modules/auth/index.js'

const router = Router()
router.use('/auth', authRoutes)
export default router
```

5. Register product in main routes:
```typescript
// src/routes/index.ts
import { yourproductRoutes } from '../products/yourproduct/index.js'

case 'yourproduct':
  return yourproductRoutes(req, res, next)
```

## Adding a Module to Existing Product

1. Create module folder:
```bash
mkdir -p src/products/restaurant/modules/menu/{controllers,models,routes}
```

2. Create module files (controllers, models, routes)

3. Export from module index:
```typescript
// src/products/restaurant/modules/menu/index.ts
export { default as menuRoutes } from './routes/menuRoutes.js'
export * from './controllers/menuController.js'
```

4. Register in product routes:
```typescript
// src/products/restaurant/routes/index.ts
import { menuRoutes } from '../modules/menu/index.js'

router.use('/menu', menuRoutes)
```

## Using Product Database Connection

Each module has access to the product's database connection:

```typescript
// In your controller
export const someController = async (req: Request, res: Response, next: NextFunction) => {
  const productConnection = (req as any).productConnection
  const product = (req as any).product
  
  // Create model using product connection
  const YourModel = productConnection.model('YourModel', YourSchema)
  
  // Or use exported model creator
  const YourModel = createYourModel(productConnection)
  
  // Query your product database
  const data = await YourModel.find()
  
  res.json({ status: 'success', data })
}
```

## Best Practices

1. **Keep modules focused**: Each module should handle one feature/domain
2. **Use product connection**: Always use `productConnection` from request
3. **Export from index**: Export all public APIs from module's `index.ts`
4. **Follow naming**: Use consistent naming (camelCase for files, PascalCase for classes)
5. **Document routes**: Add JSDoc comments for API documentation
6. **Isolate modules**: Modules should be independent and reusable

## Example: Complete Product with Modules

```
restaurant/
├── modules/
│   ├── auth/
│   │   ├── controllers/
│   │   │   └── authController.ts
│   │   ├── routes/
│   │   │   └── authRoutes.ts
│   │   └── index.ts
│   ├── orders/
│   │   ├── controllers/
│   │   │   └── orderController.ts
│   │   ├── models/
│   │   │   └── Order.ts
│   │   ├── routes/
│   │   │   └── orderRoutes.ts
│   │   └── index.ts
│   └── menu/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── index.ts
├── controllers/
│   └── dashboardController.ts
├── routes/
│   └── index.ts              # Imports all modules
└── index.ts                   # Main export
```

## Route Organization

Routes are organized hierarchically:

- **Product routes** (`/api/v1/restaurant/*`): Defined in `routes/index.ts`
- **Module routes** (`/api/v1/restaurant/orders/*`): Defined in `modules/orders/routes/orderRoutes.ts`
- **Module sub-routes**: Can be further organized within modules

Example URL structure:
- `/api/v1/restaurant/auth/login` → `modules/auth/routes/authRoutes.ts`
- `/api/v1/restaurant/orders` → `modules/orders/routes/orderRoutes.ts`
- `/api/v1/restaurant/dashboard` → `controllers/dashboardController.ts`
