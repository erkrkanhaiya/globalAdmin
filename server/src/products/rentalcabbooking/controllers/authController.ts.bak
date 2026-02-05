import { Request, Response, NextFunction } from 'express'
import { CustomError } from "../../../../middleware/errorHandler.js'

/**
 * @desc    Rental Cab Booking login
 * @route   POST /api/v1/rentalcabbooking/login
 * @access  Public (with Basic Auth)
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = (req as any).product
    const productConnection = (req as any).productConnection

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
}
