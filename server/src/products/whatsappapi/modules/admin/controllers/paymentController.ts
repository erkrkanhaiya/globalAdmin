import { Response, NextFunction } from 'express'
import { Payment } from '../../payment/models/Payment.js'
import { CustomError } from "../../../../middleware/errorHandler.js'
import { AuthRequest } from "../../../../middleware/auth.js'

// @desc    Get all payments (Admin)
// @route   GET /api/v1/admin/payments
// @access  Private (Admin)
export const getAllPayments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, userId, propertyId, page = 1, limit = 20, sort = '-createdAt' } = req.query

    const query: any = {}

    if (status) query.status = status
    if (userId) query.userId = userId
    if (propertyId) query.propertyId = propertyId

    const skip = (Number(page) - 1) * Number(limit)

    const payments = await Payment.find(query)
      .populate('userId', 'name email')
      .populate('propertyId', 'name images')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))

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

// @desc    Get payment by ID (Admin)
// @route   GET /api/v1/admin/payments/:id
// @access  Private (Admin)
export const getPaymentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('propertyId', 'name images address')

    if (!payment) {
      throw new CustomError('Payment not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        payment,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update payment status (Admin)
// @route   PATCH /api/v1/admin/payments/:id/status
// @access  Private (Admin)
export const updatePaymentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body

    if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      throw new CustomError('Invalid payment status', 400)
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('userId', 'name email')
      .populate('propertyId', 'name')

    if (!payment) {
      throw new CustomError('Payment not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        payment,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get payment statistics (Admin)
// @route   GET /api/v1/admin/payments/stats
// @access  Private (Admin)
export const getPaymentStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query

    const query: any = {}
    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate as string)
      if (endDate) query.createdAt.$lte = new Date(endDate as string)
    }

    const [total, completed, pending, failed, totalAmount] = await Promise.all([
      Payment.countDocuments(query),
      Payment.countDocuments({ ...query, status: 'completed' }),
      Payment.countDocuments({ ...query, status: 'pending' }),
      Payment.countDocuments({ ...query, status: 'failed' }),
      Payment.aggregate([
        { $match: { ...query, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          total,
          completed,
          pending,
          failed,
          totalAmount: totalAmount[0]?.total || 0,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

