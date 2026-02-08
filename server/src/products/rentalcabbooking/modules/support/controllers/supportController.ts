import { Response, NextFunction } from 'express'
import { SupportTicket } from '@/modules/support/models/SupportTicket.js'
import { CustomError } from '@/middleware/errorHandler.js'
import { AuthRequest } from '@/middleware/auth.js'

// @desc    Get all support tickets
// @route   GET /api/v1/support/tickets
// @access  Private
export const getTickets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query
    const query: any = {}

    // Users can only see their own tickets, admins can see all
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      query.userId = req.user?.id
    }

    if (status) query.status = status
    if (category) query.category = category

    const skip = (Number(page) - 1) * Number(limit)
    const tickets = await SupportTicket.find(query)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await SupportTicket.countDocuments(query)

    res.status(200).json({
      status: 'success',
      data: {
        tickets,
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

// @desc    Get single ticket
// @route   GET /api/v1/support/tickets/:id
// @access  Private
export const getTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query: any = { _id: req.params.id }

    // Users can only see their own tickets, admins can see all
    if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
      query.userId = req.user?.id
    }

    const ticket = await SupportTicket.findOne(query)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .populate('replies.userId', 'name email')

    if (!ticket) {
      throw new CustomError('Ticket not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        ticket,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create support ticket
// @route   POST /api/v1/support/tickets
// @access  Private
export const createTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticket = await SupportTicket.create({
      ...req.body,
      userId: req.user?.id,
    })

    await ticket.populate('userId', 'name email')

    res.status(201).json({
      status: 'success',
      data: {
        ticket,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Add reply to ticket
// @route   POST /api/v1/support/tickets/:id/reply
// @access  Private
export const addReply = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message } = req.body
    const ticket = await SupportTicket.findById(req.params.id)

    if (!ticket) {
      throw new CustomError('Ticket not found', 404)
    }

    // Check access
    if (
      req.user?.role !== 'admin' &&
      req.user?.role !== 'super_admin' &&
      ticket.userId.toString() !== req.user?.id
    ) {
      throw new CustomError('Not authorized to reply to this ticket', 403)
    }

    ticket.replies?.push({
      userId: req.user?.id as any,
      message,
      createdAt: new Date(),
    })

    if (ticket.status === 'closed') {
      ticket.status = 'open'
    }

    await ticket.save()
    await ticket.populate('replies.userId', 'name email')

    res.status(200).json({
      status: 'success',
      data: {
        ticket,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update ticket status (Admin only)
// @route   PATCH /api/v1/support/tickets/:id/status
// @access  Private (Admin)
export const updateTicketStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, assignedTo } = req.body
    const ticket = await SupportTicket.findById(req.params.id)

    if (!ticket) {
      throw new CustomError('Ticket not found', 404)
    }

    if (status) {
      ticket.status = status
      if (status === 'resolved') {
        ticket.resolvedAt = new Date()
        ticket.resolvedBy = req.user?.id as any
      }
    }

    if (assignedTo) {
      ticket.assignedTo = assignedTo
    }

    await ticket.save()
    await ticket.populate('assignedTo', 'name email')

    res.status(200).json({
      status: 'success',
      data: {
        ticket,
      },
    })
  } catch (error) {
    next(error)
  }
}

