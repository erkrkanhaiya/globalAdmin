import { Response, NextFunction } from 'express'
import { AuctionRequest } from '@/products/livenotes/modules/AuctionRequest.js"
import { CustomError } from "@/middleware/errorHandler.js"
import { AuthRequest } from "@/middleware/auth.js"

// @desc    Get all auction requests
// @route   GET /api/v1/auction-requests
// @access  Private (Admin)
export const getAuctionRequests = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    const query: any = {}

    if (status && status !== 'all') {
      query.status = status
    }

    const skip = (Number(page) - 1) * Number(limit)

    const requests = await AuctionRequest.find(query)
      .populate('propertyId', 'name address city state')
      .populate('propertyOwnerId', 'name email')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await AuctionRequest.countDocuments(query)

    res.status(200).json({
      status: 'success',
      data: {
        requests,
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

// @desc    Get single auction request
// @route   GET /api/v1/auction-requests/:id
// @access  Private (Admin)
export const getAuctionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = await AuctionRequest.findById(req.params.id)
      .populate('propertyId')
      .populate('propertyOwnerId', 'name email')
      .populate('reviewedBy', 'name email')

    if (!request) {
      throw new CustomError('Auction request not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        request,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Submit auction request
// @route   POST /api/v1/auction-requests
// @access  Private
export const submitAuctionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const request = await AuctionRequest.create({
      ...req.body,
      propertyOwnerId: req.user?.id,
    })

    await request.populate('propertyId', 'name address')

    res.status(201).json({
      status: 'success',
      data: {
        request,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Approve auction request
// @route   PUT /api/v1/auction-requests/:id/approve
// @access  Private (Admin)
export const approveAuctionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { auctionDate, paymentLink } = req.body

    if (!auctionDate || !paymentLink) {
      throw new CustomError('Auction date and payment link are required', 400)
    }

    const request = await AuctionRequest.findById(req.params.id)

    if (!request) {
      throw new CustomError('Auction request not found', 404)
    }

    if (request.status !== 'pending') {
      throw new CustomError('Request has already been processed', 400)
    }

    request.status = 'approved'
    request.auctionDate = new Date(auctionDate)
    request.paymentLink = paymentLink
    request.reviewedBy = req.user?.id as any
    request.reviewedAt = new Date()

    await request.save()

    await request.populate('propertyId', 'name address')
    await request.populate('propertyOwnerId', 'name email')

    res.status(200).json({
      status: 'success',
      data: {
        request,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Decline auction request
// @route   PUT /api/v1/auction-requests/:id/decline
// @access  Private (Admin)
export const declineAuctionRequest = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { declineReason } = req.body

    if (!declineReason) {
      throw new CustomError('Decline reason is required', 400)
    }

    const request = await AuctionRequest.findById(req.params.id)

    if (!request) {
      throw new CustomError('Auction request not found', 404)
    }

    if (request.status !== 'pending') {
      throw new CustomError('Request has already been processed', 400)
    }

    request.status = 'declined'
    request.declineReason = declineReason
    request.reviewedBy = req.user?.id as any
    request.reviewedAt = new Date()

    await request.save()

    await request.populate('propertyId', 'name address')
    await request.populate('propertyOwnerId', 'name email')

    res.status(200).json({
      status: 'success',
      data: {
        request,
      },
    })
  } catch (error) {
    next(error)
  }
}

