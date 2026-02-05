import { Router } from 'express'
import { body } from 'express-validator'
import {
  registerCustomer,
  loginUser,
  requestAgentVerification,
  requestDoctorVerification,
  getProfile,
  updateProfile,
  getVerificationStatus,
  changePassword,
} from '../controllers/userController.js'
import { protect } from '../../../../middleware/auth.js'
import { basicAuth } from '../../../../middleware/basicAuth.js'
import { validate } from '../../../../middleware/validator.js'
import { agentRoutes } from '../../agent/index.js'
import { propertyRoutes } from '../../property/index.js'
import { auctionRoutes } from '../../auction/index.js'
import { paymentRoutes } from '../../payment/index.js'
import { supportRoutes } from '../../support/index.js'

const router = Router()

/**
 * @swagger
 * /api/v1/user/auth/register:
 *   post:
 *     summary: Register new customer (Email/Password or Google)
 *     tags: [User - Auth]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Full name (required for email registration)
 *               email:
 *                 type: string
 *                 description: Email address (required for email registration)
 *               password:
 *                 type: string
 *                 description: Password (required for email registration, min 6 chars)
 *               mobile:
 *                 type: string
 *                 description: Mobile number (optional)
 *               countryCode:
 *                 type: string
 *                 description: Country code (e.g., +1, +91) - default +1
 *               googleIdToken:
 *                 type: string
 *                 description: Google ID token (for Google Sign-In)
 *               source:
 *                 type: string
 *                 enum: [mobile, web]
 *                 default: web
 *     responses:
 *       201:
 *         description: Customer registered successfully
 *       200:
 *         description: Google account linked to existing account
 *       400:
 *         description: Validation error or user already exists
 */
router.post(
  '/auth/register',
  basicAuth,
  validate([
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Name cannot be empty if provided'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('mobile')
      .optional()
      .isString()
      .withMessage('Mobile must be a string'),
    body('countryCode')
      .optional()
      .isString()
      .withMessage('Country code must be a string'),
    body('googleIdToken')
      .optional()
      .isString()
      .withMessage('Google ID token must be a string'),
    body('source')
      .optional()
      .isIn(['mobile', 'web'])
      .withMessage('Source must be either mobile or web'),
  ]),
  registerCustomer
)

/**
 * @swagger
 * /api/v1/user/auth/login:
 *   post:
 *     summary: Login user (Email/Mobile or Google)
 *     tags: [User - Auth]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - required:
 *                   - email
 *                   - password
 *                 properties:
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *               - required:
 *                   - mobile
 *                   - countryCode
 *                   - password
 *                 properties:
 *                   mobile:
 *                     type: string
 *                   countryCode:
 *                     type: string
 *                   password:
 *                     type: string
 *               - required:
 *                   - googleIdToken
 *                 properties:
 *                   googleIdToken:
 *                     type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post(
  '/auth/login',
  basicAuth,
  validate([
    body('googleIdToken')
      .optional()
      .isString()
      .withMessage('Google ID token must be a string'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('mobile')
      .optional()
      .isString()
      .withMessage('Mobile must be a string'),
    body('countryCode')
      .optional()
      .isString()
      .withMessage('Country code must be a string'),
    body('password')
      .optional()
      .isString()
      .withMessage('Password must be a string'),
  ]),
  loginUser
)

/**
 * @swagger
 * /api/v1/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User - Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 */
router.get('/profile', protect, getProfile)

/**
 * @swagger
 * /api/v1/user/profile:
 *   patch:
 *     summary: Update user profile
 *     tags: [User - Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.patch('/profile', protect, updateProfile)

/**
 * @swagger
 * /api/v1/user/agents/request-verification:
 *   post:
 *     summary: Request agent verification
 *     tags: [User - Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documents
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Verification request submitted
 */
router.post(
  '/agents/request-verification',
  protect,
  validate([
    body('documents').isArray().withMessage('Documents array is required'),
    body('documents.*').isString().withMessage('Each document must be a string (URL)'),
  ]),
  requestAgentVerification
)

/**
 * @swagger
 * /api/v1/user/doctors/request-verification:
 *   post:
 *     summary: Request doctor verification
 *     tags: [User - Verification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - documents
 *               - licenseNumber
 *             properties:
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *               licenseNumber:
 *                 type: string
 *               specialization:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor verification request submitted
 */
router.post(
  '/doctors/request-verification',
  protect,
  validate([
    body('documents').isArray().withMessage('Documents array is required'),
    body('licenseNumber').notEmpty().withMessage('License number is required'),
  ]),
  requestDoctorVerification
)

/**
 * @swagger
 * /api/v1/user/verification/status:
 *   get:
 *     summary: Get verification status
 *     tags: [User - Verification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification status
 */
router.get('/verification/status', protect, getVerificationStatus)

/**
 * @swagger
 * /api/v1/user/change-password:
 *   patch:
 *     summary: Change user password
 *     tags: [User - Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Current password is incorrect
 */
router.patch(
  '/change-password',
  protect,
  validate([
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  ]),
  changePassword
)

// User-facing routes for browsing resources (mounted AFTER specific routes to avoid conflicts)
router.use('/agents', agentRoutes)  // User browsing agents: /api/v1/user/agents
router.use('/properties', propertyRoutes)  // User browsing properties: /api/v1/user/properties
router.use('/auction-requests', auctionRoutes)  // User auction operations: /api/v1/user/auction-requests
router.use('/payments', paymentRoutes)  // User payment operations: /api/v1/user/payments
router.use('/support', supportRoutes)  // User support tickets: /api/v1/user/support

export default router
