import { Response, NextFunction } from 'express'
import { SupportTicket } from '../../support/models/SupportTicket.js'
import { CustomError } from "../../../../middleware/errorHandler.js'
import { AuthRequest } from "../../../../middleware/auth.js'

// @desc    Get all support tickets (Admin)
// @route   GET /api/v1/admin/support/tickets
// @access  Private (Admin)
export const getAllTickets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, category, priority, page = 1, limit = 20 } = req.query

    const query: any = {}

    if (status) query.status = status
    if (category) query.category = category
    if (priority) query.priority = priority

    const skip = (Number(page) - 1) * Number(limit)

    const tickets = await SupportTicket.find(query)
      .populate('userId', 'name email phone')
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

// @desc    Get ticket by ID (Admin)
// @route   GET /api/v1/admin/support/tickets/:id
// @access  Private (Admin)
export const getTicketById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('replies.userId', 'name email')
      .populate('resolvedBy', 'name email')

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

// @desc    Update ticket status (Admin)
// @route   PATCH /api/v1/admin/support/tickets/:id/status
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
      ticket.assignedTo = assignedTo as any
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

// @desc    Add reply to ticket (Admin)
// @route   POST /api/v1/admin/support/tickets/:id/reply
// @access  Private (Admin)
export const addTicketReply = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message } = req.body

    if (!message) {
      throw new CustomError('Message is required', 400)
    }

    const ticket = await SupportTicket.findById(req.params.id)

    if (!ticket) {
      throw new CustomError('Ticket not found', 404)
    }

    ticket.replies = ticket.replies || []
    ticket.replies.push({
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

// @desc    Delete ticket (Admin)
// @route   DELETE /api/v1/admin/support/tickets/:id
// @access  Private (Admin)
export const deleteTicket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id)

    if (!ticket) {
      throw new CustomError('Ticket not found', 404)
    }

    res.status(200).json({
      status: 'success',
      message: 'Ticket deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

