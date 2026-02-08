import { Router } from 'express'
import {
  getAuctionRequest,
  submitAuctionRequest,
} from '../controllers/auctionController.js';
import { protect } from '@/middleware/auth.js';

const router = Router()

router.use(protect)

/**
 * @swagger
 * /api/v1/user/auction-requests:
 *   post:
 *     summary: Submit an auction request (User)
 *     tags: [User - Auctions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               propertyId:
 *                 type: string
 *               reservePrice:
 *                 type: number
 *               startDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Auction request submitted
 */
router.post('/', submitAuctionRequest)

/**
 * @swagger
 * /api/v1/user/auction-requests/{id}:
 *   get:
 *     summary: Get auction request by ID (User)
 *     tags: [User - Auctions]
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
 *         description: Auction request details
 */
router.get('/:id', getAuctionRequest)

export default router

