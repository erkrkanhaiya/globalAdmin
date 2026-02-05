import { Router, Request, Response, NextFunction } from 'express'
import { protect } from '../../../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(protect)

/**
 * @desc    LiveNotes login endpoint
 * @route   POST /api/v1/livenotes/login
 * @access  Public (with Basic Auth)
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = (req as any).product

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
 * @desc    Get LiveNotes dashboard data
 * @route   GET /api/v1/livenotes/dashboard
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
