# Convert Rentalcabooking Imports to Absolute Paths

## Quick Conversion Script

Run this from the `server` directory:

```bash
cd server
python3 convert-rentalcabooking-imports.py
```

## Manual Conversion Guide

### 1. server.ts
Replace these imports:
```typescript
// OLD
import { config } from '../../config/env.js'
import { connectDatabase } from '../../config/database.js'
import { getProductConnection } from '../../config/multiDatabase.js'
import { Product } from '../../modules/product/models/Product.js'
import { errorHandler } from "../../middleware/errorHandler.js"
import { requestLogger } from "../../middleware/requestLogger.js"
import { swaggerSpec } from '../../config/swagger.rentalcabooking.js'
import rentalcabookingRoutes from './routes/index.js'

// NEW
import { config } from '@/config/env.js'
import { connectDatabase } from '@/config/database.js'
import { getProductConnection } from '@/config/multiDatabase.js'
import { Product } from '@/modules/product/models/Product.js'
import { errorHandler } from "@/middleware/errorHandler.js"
import { requestLogger } from "@/middleware/requestLogger.js"
import { swaggerSpec } from '@/config/swagger.rentalcabooking.js'
import rentalcabookingRoutes from '@/products/rentalcabooking/routes/index.js'
```

### 2. Module Files (controllers, routes, etc.)

**Middleware imports:**
- `../../../../../middleware/auth.js` → `@/middleware/auth.js`
- `../../../../../middleware/errorHandler.js` → `@/middleware/errorHandler.js`
- `../../../../../middleware/basicAuth.js` → `@/middleware/basicAuth.js`
- `../../../../../middleware/validator.js` → `@/middleware/validator.js`

**Config imports:**
- `../../../../../config/rateLimit.js` → `@/config/rateLimit.js`
- `../../../../../config/env.js` → `@/config/env.js`

**Cross-module imports:**
- `../../auth/models/User.js` → `@/products/rentalcabooking/modules/auth/models/User.js`
- `../../property/models/Property.js` → `@/products/rentalcabooking/modules/property/models/Property.js`
- etc.

**Keep relative (within same module):**
- `../controllers/...` → Keep as is
- `../models/...` → Keep as is

### 3. routes/index.ts
- `../modules/...` → `@/products/rentalcabooking/modules/...`
- `../controllers/...` → `@/products/rentalcabooking/controllers/...`

## Pattern Summary

- External (middleware, config): Always use `@/`
- Cross-module: Use `@/products/rentalcabooking/modules/...`
- Within-module: Keep relative (`../`)

