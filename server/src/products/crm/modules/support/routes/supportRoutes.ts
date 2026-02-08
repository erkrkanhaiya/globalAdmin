import { Router } from 'express'
import {
  getTickets,
  getTicket,
  createTicket,
  addReply,
} from '@/products/crm/modules/supportController.js"
import { protect } from "@/middleware/auth.js"

const router = Router()

router.use(protect)

/**
 * @swagger
 * /api/v1/user/support/tickets:
 *   get:
 *     summary: Get all support tickets (User)
 *     tags: [User - Support]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of support tickets
 *   post:
 *     summary: Create a new support ticket (User)
 *     tags: [User - Support]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Support ticket created
 */
router.route('/tickets').get(getTickets).post(createTicket)

/**
 * @swagger
 * /api/v1/user/support/tickets/{id}:
 *   get:
 *     summary: Get support ticket by ID (User)
 *     tags: [User - Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support ticket details
 */
router.get('/tickets/:id', getTicket)

/**
 * @swagger
 * /api/v1/user/support/tickets/{id}/reply:
 *   post:
 *     summary: Add reply to support ticket (User)
 *     tags: [User - Support]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added successfully
 */
router.post('/tickets/:id/reply', addReply)

export default router

