import { Router } from 'express'
import {
  createPayment,
  getPayment,
  getPayments,
  updatePaymentStatus,
} from '@/products/crm/modules/paymentController.js"
import { protect } from "@/middleware/auth.js"

const router = Router()

router.use(protect)

/**
 * @swagger
 * /api/v1/user/payments:
 *   get:
 *     summary: Get all payments (User)
 *     tags: [User - Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of payments
 *   post:
 *     summary: Create a new payment (User)
 *     tags: [User - Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               propertyId:
 *                 type: string
 *               userId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment created successfully
 */
router.route('/').get(getPayments).post(createPayment)

/**
 * @swagger
 * /api/v1/user/payments/{id}:
 *   get:
 *     summary: Get payment by ID (User)
 *     tags: [User - Payments]
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
 *         description: Payment details
 */
router.route('/:id').get(getPayment)

export default router

