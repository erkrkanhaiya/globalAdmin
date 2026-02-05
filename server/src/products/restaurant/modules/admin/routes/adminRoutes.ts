import { Router } from 'express'
import {
  getAllUsers,
  createAgent as createUserAgent,
  convertToAgent,
  verifyUser,
  updateUserRole,
  updateUserStatus,
  getUserById,
} from '../controllers/adminController.js'
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js'
import {
  getAllAgents,
  getAgentById,
  createAgent as createAgentDocument,
  updateAgent,
  deleteAgent,
} from '../controllers/agentController.js'
import {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  getPaymentStats,
} from '../controllers/paymentController.js'
import {
  getAllAuctionRequests,
  getAuctionRequestById,
  approveAuctionRequest,
  declineAuctionRequest,
  deleteAuctionRequest,
} from '../controllers/auctionController.js'
import {
  getAllTickets,
  getTicketById,
  updateTicketStatus,
  addTicketReply,
  deleteTicket,
} from '../controllers/supportController.js'
import { getDashboardStats } from '../controllers/dashboardController.js'
import { protect, authorize } from "../../../../middleware/auth.js'

const router = Router()

// All admin routes require authentication and admin role
router.use(protect)
router.use(authorize('super_admin', 'admin'))

// ==================== Dashboard ====================
/**
 * @swagger
 * /api/v1/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 */
router.get('/dashboard', getDashboardStats)

// ==================== Users Management ====================
/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', getAllUsers)

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users/:id', getUserById)

/**
 * @swagger
 * /api/v1/admin/users/{id}/role:
 *   patch:
 *     summary: Update user role (Super Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/users/:id/role', authorize('super_admin'), updateUserRole)

/**
 * @swagger
 * /api/v1/admin/users/{id}/status:
 *   patch:
 *     summary: Update user status
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/users/:id/status', updateUserStatus)

/**
 * @swagger
 * /api/v1/admin/users/{id}/verify:
 *   post:
 *     summary: Verify agent/doctor
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/users/:id/verify', verifyUser)

/**
 * @swagger
 * /api/v1/admin/users/{id}/convert-to-agent:
 *   post:
 *     summary: Convert customer to agent
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 */
router.post('/users/:id/convert-to-agent', convertToAgent)

// ==================== Agents Management ====================
/**
 * @swagger
 * /api/v1/admin/agents:
 *   get:
 *     summary: Get all agents
 *     tags: [Admin - Agents]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create agent
 *     tags: [Admin - Agents]
 *     security:
 *       - bearerAuth: []
 */
router.get('/agents', getAllAgents)
router.post('/agents', createAgentDocument) // Creates Agent document

/**
 * @swagger
 * /api/v1/admin/agents/{id}:
 *   get:
 *     summary: Get agent by ID
 *     tags: [Admin - Agents]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update agent
 *     tags: [Admin - Agents]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete agent
 *     tags: [Admin - Agents]
 *     security:
 *       - bearerAuth: []
 */
router.get('/agents/:id', getAgentById)
router.put('/agents/:id', updateAgent)
router.delete('/agents/:id', deleteAgent)

// ==================== Properties Management ====================
/**
 * @swagger
 * /api/v1/admin/properties:
 *   get:
 *     summary: Get all properties
 *     tags: [Admin - Properties]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Create property
 *     tags: [Admin - Properties]
 *     security:
 *       - bearerAuth: []
 */
router.get('/properties', getAllProperties)
router.post('/properties', createProperty)

/**
 * @swagger
 * /api/v1/admin/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     tags: [Admin - Properties]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Update property
 *     tags: [Admin - Properties]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete property
 *     tags: [Admin - Properties]
 *     security:
 *       - bearerAuth: []
 */
router.get('/properties/:id', getPropertyById)
router.put('/properties/:id', updateProperty)
router.delete('/properties/:id', deleteProperty)

// ==================== Payments Management ====================
/**
 * @swagger
 * /api/v1/admin/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Admin - Payments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/payments', getAllPayments)

/**
 * @swagger
 * /api/v1/admin/payments/stats:
 *   get:
 *     summary: Get payment statistics
 *     tags: [Admin - Payments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/payments/stats', getPaymentStats)

/**
 * @swagger
 * /api/v1/admin/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     tags: [Admin - Payments]
 *     security:
 *       - bearerAuth: []
 */
router.get('/payments/:id', getPaymentById)

/**
 * @swagger
 * /api/v1/admin/payments/{id}/status:
 *   patch:
 *     summary: Update payment status
 *     tags: [Admin - Payments]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/payments/:id/status', updatePaymentStatus)

// ==================== Auction Requests Management ====================
/**
 * @swagger
 * /api/v1/admin/auction-requests:
 *   get:
 *     summary: Get all auction requests
 *     tags: [Admin - Auctions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/auction-requests', getAllAuctionRequests)

/**
 * @swagger
 * /api/v1/admin/auction-requests/{id}:
 *   get:
 *     summary: Get auction request by ID
 *     tags: [Admin - Auctions]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete auction request
 *     tags: [Admin - Auctions]
 *     security:
 *       - bearerAuth: []
 */
router.get('/auction-requests/:id', getAuctionRequestById)
router.delete('/auction-requests/:id', deleteAuctionRequest)

/**
 * @swagger
 * /api/v1/admin/auction-requests/{id}/approve:
 *   post:
 *     summary: Approve auction request
 *     tags: [Admin - Auctions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/auction-requests/:id/approve', approveAuctionRequest)

/**
 * @swagger
 * /api/v1/admin/auction-requests/{id}/decline:
 *   post:
 *     summary: Decline auction request
 *     tags: [Admin - Auctions]
 *     security:
 *       - bearerAuth: []
 */
router.post('/auction-requests/:id/decline', declineAuctionRequest)

// ==================== Support Tickets Management ====================
/**
 * @swagger
 * /api/v1/admin/support/tickets:
 *   get:
 *     summary: Get all support tickets
 *     tags: [Admin - Support]
 *     security:
 *       - bearerAuth: []
 */
router.get('/support/tickets', getAllTickets)

/**
 * @swagger
 * /api/v1/admin/support/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Admin - Support]
 *     security:
 *       - bearerAuth: []
 *   delete:
 *     summary: Delete ticket
 *     tags: [Admin - Support]
 *     security:
 *       - bearerAuth: []
 */
router.get('/support/tickets/:id', getTicketById)
router.delete('/support/tickets/:id', deleteTicket)

/**
 * @swagger
 * /api/v1/admin/support/tickets/{id}/status:
 *   patch:
 *     summary: Update ticket status
 *     tags: [Admin - Support]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/support/tickets/:id/status', updateTicketStatus)

/**
 * @swagger
 * /api/v1/admin/support/tickets/{id}/reply:
 *   post:
 *     summary: Add reply to ticket
 *     tags: [Admin - Support]
 *     security:
 *       - bearerAuth: []
 */
router.post('/support/tickets/:id/reply', addTicketReply)

export default router
