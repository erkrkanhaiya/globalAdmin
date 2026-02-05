import { Router, Request, Response, NextFunction } from 'express'
import { protect } from '../../../middleware/auth.js'
import { CustomError } from '../../../middleware/errorHandler.js'

const router = Router()

// All routes require authentication
router.use(protect)

/**
 * @desc    Restaurant login endpoint
 * @route   POST /api/v1/restaurant/login
 * @access  Public (with Basic Auth)
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productConnection = (req as any).productConnection
    const product = (req as any).product

    // Example: Get user model from product database
    // const User = productConnection.model('User', UserSchema)
    
    res.status(200).json({
      status: 'success',
      message: `Login endpoint for ${product.displayName}`,
      data: {
        product: product.slug,
        database: product.databaseName,
      },
    })
  } catch (error) {
    next(error)
  }
})

/**
 * @desc    Get restaurant dashboard data
 * @route   GET /api/v1/restaurant/dashboard
 * @access  Private
 */
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = (req as any).product

    res.status(200).json({
      status: 'success',
      data: {
        product: product.slug,
        message: `Dashboard data for ${product.displayName}`,
      },
    })
  } catch (error) {
    next(error)
  }
})

export default router
