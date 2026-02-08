import { Router } from 'express'
import { authRoutes } from '@/products/restaurant/modules/auth/index.js'
import { adminRoutes } from '@/products/restaurant/modules/admin/index.js'
import { userRoutes } from '@/products/restaurant/modules/user/index.js'
import { createProductRouter, productRouter } from '@/middleware/productRouter.js'

// Import product routes from products folder
// Each product has its own complete folder structure with controllers, models, routes, etc.
import { restaurantRoutes } from '@/products/restaurant/index.js'
import { livenotesRoutes } from '@/products/livenotes/routes/index.js' 
import { rentalcabbookingRoutes } from '@/products/rentalcabbooking/index.js'
import { whatsappapiRoutes } from '@/products/whatsappapi/index.js'
import { crmRoutes } from '@/products/crm/index.js'

const router = Router()

// Standard auth routes (public)
router.use('/auth', authRoutes)

// Product management routes (get all products, create, update)
router.use('/products', createProductRouter(restaurantRoutes))

// Product-specific routes (dynamic routing based on product slug)
// These routes will be accessible as:
// /api/v1/restaurant/*, /api/v1/livenotes/*, etc.
// Each product is in its own folder: src/products/{productSlug}/
// with controllers/, models/, routes/, services/, etc.
router.use('/:productSlug', productRouter, (req: any, res: any, next: any) => {
  const productSlug = req.params.productSlug

  // Route to appropriate product routes based on slug
  // Each product has its own complete folder structure
  switch (productSlug) {
    case 'restaurant':
      return restaurantRoutes(req, res, next)
    case 'livenotes':
      return livenotesRoutes(req, res, next)
    case 'rentalcabbooking':
      return rentalcabbookingRoutes(req, res, next)
    case 'whatsappapi':
      return whatsappapiRoutes(req, res, next)
    case 'crm':
      return crmRoutes(req, res, next)
    // Add more products here as needed
    // To add a new product:
    // 1. Create folder: src/products/yourproduct/
    // 2. Add controllers/, models/, routes/, etc.
    // 3. Create routes/index.ts and index.ts
    // 4. Import and add case here
    default:
      // For unknown products, return product info (they can add routes later)
      return res.status(200).json({
        status: 'success',
        message: `Product '${productSlug}' is available`,
        data: {
          product: req.product,
          note: `Create folder src/products/${productSlug}/ with routes/index.ts, then register in routes/index.ts`,
        },
      })
  }
})

// Admin routes - All admin endpoints under /admin/
// Example: /api/v1/admin/dashboard, /api/v1/admin/users, /api/v1/admin/agents, etc.
router.use('/admin', adminRoutes)

// User routes - All user endpoints under /user/
// Example: /api/v1/user/profile, /api/v1/user/agents, /api/v1/user/properties, etc.
router.use('/user', userRoutes)

export default router
