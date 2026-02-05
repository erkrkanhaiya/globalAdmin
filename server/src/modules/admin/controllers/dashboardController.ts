import { Response, NextFunction } from 'express'
import { User } from '../../auth/models/User.js'
import { Property } from '../../property/models/Property.js'
import { Agent } from '../../agent/models/Agent.js'
import { Payment } from '../../payment/models/Payment.js'
import { AuctionRequest } from '../../auction/models/AuctionRequest.js'
import { SupportTicket } from '../../support/models/SupportTicket.js'
import { CustomError } from '../../../middleware/errorHandler.js'
import { AuthRequest } from '../../../middleware/auth.js'

// @desc    Get admin dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalProperties,
      availableProperties,
      totalAgents,
      activeAgents,
      totalPayments,
      completedPayments,
      pendingAuctionRequests,
      openTickets,
      recentPayments,
      recentUsers,
    ] = await Promise.all([
      // Users
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      
      // Properties
      Property.countDocuments(),
      Property.countDocuments({ status: 'available' }),
      
      // Agents
      Agent.countDocuments(),
      Agent.countDocuments({ status: 'active' }),
      
      // Payments
      Payment.countDocuments(),
      Payment.countDocuments({ status: 'completed' }),
      
      // Auction Requests
      AuctionRequest.countDocuments({ status: 'pending' }),
      
      // Support Tickets
      SupportTicket.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      
      // Recent Payments (last 10)
      Payment.find()
        .populate('userId', 'name email')
        .populate('propertyId', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('amount status paymentMethod createdAt'),
      
      // Recent Users (last 10)
      User.find()
        .select('name email role createdAt isActive')
        .sort({ createdAt: -1 })
        .limit(10),
    ])

    // Calculate total revenue
    const revenueResult = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])

    const totalRevenue = revenueResult[0]?.total || 0

    // Get user breakdown by role
    const userByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
    ])

    // Get property breakdown by status
    const propertyByStatus = await Property.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats: {
          users: {
            total: totalUsers,
            active: activeUsers,
            byRole: userByRole,
          },
          properties: {
            total: totalProperties,
            available: availableProperties,
            byStatus: propertyByStatus,
          },
          agents: {
            total: totalAgents,
            active: activeAgents,
          },
          payments: {
            total: totalPayments,
            completed: completedPayments,
            revenue: totalRevenue,
          },
          auctions: {
            pending: pendingAuctionRequests,
          },
          support: {
            open: openTickets,
          },
        },
        recent: {
          payments: recentPayments,
          users: recentUsers,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

