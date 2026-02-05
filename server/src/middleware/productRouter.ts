import { Request, Response, NextFunction, Router } from 'express'
import { Product } from '../modules/product/models/Product.js'
import { getProductConnection } from '../config/multiDatabase.js'
import { CustomError } from './errorHandler.js'

/**
 * Middleware to create product-specific routes dynamically
 * This middleware extracts the product slug from the URL and sets up the product context
 * 
 * Usage: app.use('/api/v1/:productSlug', productRouter, ...productRoutes)
 */
export const productRouter = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productSlug } = req.params

    if (!productSlug) {
      throw new CustomError('Product slug is required', 400)
    }

    // Find product in main database
    const product = await Product.findOne({ slug: productSlug, isActive: true })

    if (!product) {
      throw new CustomError(`Product '${productSlug}' not found or inactive`, 404)
    }

    // Get or create connection to product's database
    const productConnection = await getProductConnection(product.slug, product.databaseName)

    // Attach product and connection to request
    ;(req as any).product = product
    ;(req as any).productConnection = productConnection

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Create product-specific router
 * This creates routes like /api/v1/restaurant/*, /api/v1/livenotes/*, etc.
 */
export const createProductRouter = (productRoutes: Router): Router => {
  const router = Router()
  
  // Apply product router middleware first
  router.use(productRouter)
  
  // Then apply product-specific routes
  router.use('/', productRoutes)
  
  return router
}
