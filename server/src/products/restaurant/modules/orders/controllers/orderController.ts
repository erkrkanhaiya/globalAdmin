import { Request, Response, NextFunction } from 'express'
import { CustomError } from "@/middleware/errorHandler.js"
import { createOrderModel } from '../models/Order.js'

/**
 * @desc    Get all orders
 * @route   GET /api/v1/restaurant/orders
 * @access  Private
 */
export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productConnection = (req as any).productConnection
    
    // Create model using product connection
    const Order = createOrderModel(productConnection)
    
    const orders = await Order.find().sort({ createdAt: -1 })

    res.status(200).json({
      status: 'success',
      data: {
        orders,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create order
 * @route   POST /api/v1/restaurant/orders
 * @access  Private
 */
export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productConnection = (req as any).productConnection
    const Order = createOrderModel(productConnection)
    
    const order = await Order.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        order,
      },
    })
  } catch (error) {
    next(error)
  }
}
