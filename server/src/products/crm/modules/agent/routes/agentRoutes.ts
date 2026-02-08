import { Router } from 'express'
import {
  getAgents,
  getAgent,
} from '@/products/crm/modules/agentController.js"
import { protect } from "@/middleware/auth.js"

const router = Router()

router.use(protect)

/**
 * @swagger
 * /api/v1/user/agents:
 *   get:
 *     summary: Get all agents (User browsing)
 *     tags: [User - Agents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of agents
 */
router.route('/').get(getAgents)

/**
 * @swagger
 * /api/v1/user/agents/{id}:
 *   get:
 *     summary: Get agent by ID (User browsing)
 *     tags: [User - Agents]
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
 *         description: Agent details
 */
router.route('/:id').get(getAgent)

export default router

