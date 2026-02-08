import { Response, NextFunction } from 'express'
import { Payment } from '../models/Payment.js'
import { CustomError } from '@/middleware/errorHandler.js'
import { AuthRequest } from '@/middleware/auth.js'

export const createPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.create({
      ...req.body,
      userId: req.user?.id,
    })
    res.status(201).json({ status: 'success', data: { payment } })
  } catch (error) {
    next(error)
  }
}

export const getPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 10, status } = req.query
    const query: any = { userId: req.user?.id }
    if (status) query.status = status

    const skip = (Number(page) - 1) * Number(limit)
    const payments = await Payment.find(query).skip(skip).limit(Number(limit))
    const total = await Payment.countDocuments(query)

    res.status(200).json({
      status: 'success',
      data: {
        payments,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getPayment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      userId: req.user?.id,
    })
    if (!payment) {
      throw new CustomError('Payment not found', 404)
    }
    res.status(200).json({ status: 'success', data: { payment } })
  } catch (error) {
    next(error)
  }
}

export const updatePaymentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!payment) {
      throw new CustomError('Payment not found', 404)
    }
    res.status(200).json({ status: 'success', data: { payment } })
  } catch (error) {
    next(error)
  }
}

