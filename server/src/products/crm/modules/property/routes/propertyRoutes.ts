import { Router } from 'express'
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertyController.js'
import { protect, authorize } from "../../../../middleware/auth.js'

const router = Router()

router.use(protect)

/**
 * @swagger
 * /api/v1/user/properties:
 *   get:
 *     summary: Get all properties (User browsing)
 *     tags: [User - Properties]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of properties
 */
router.route('/').get(getProperties)

/**
 * @swagger
 * /api/v1/user/properties/{id}:
 *   get:
 *     summary: Get property by ID (User browsing)
 *     tags: [User - Properties]
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
 *         description: Property details
 */
router.route('/:id').get(getProperty)

export default router

