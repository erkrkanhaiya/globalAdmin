import { Request, Response, NextFunction } from 'express'
import { CustomError } from "@/middleware/errorHandler.js"

/**
 * @desc    Get restaurant dashboard data
 * @route   GET /api/v1/restaurant/dashboard
 * @access  Private
 */
export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = (req as any).product
    const productConnection = (req as any).productConnection

    // Example: Get data from product database
    // const Order = productConnection.model('Order', OrderSchema)
    // const orders = await Order.find()

    res.status(200).json({
      status: 'success',
      data: {
        product: product.slug,
        message: `Dashboard data for ${product.displayName}`,
        // Add your dashboard data here
      },
    })
  } catch (error) {
    next(error)
  }
}
