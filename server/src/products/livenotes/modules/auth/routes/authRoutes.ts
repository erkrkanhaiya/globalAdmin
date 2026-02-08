import { Router } from 'express'
import { body } from 'express-validator'
import { register, login } from '@/products/livenotes/modules/authController.js'
import { basicAuth } from "@/middleware/basicAuth.js"
import { validate } from "@/middleware/validator.js"

const router = Router()

/**
 * @swagger
 * /api/v1/livenotes/auth/register:
 *   post:
 *     summary: Register new user for mobile app (Email/Password or Google Sign-In)
 *     tags: [LiveNotes - Auth]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - title: Email/Password Registration
 *                 required:
 *                   - name
 *                   - email
 *                   - password
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Full name (required for email registration)
 *                     example: John Doe
 *                   email:
 *                     type: string
 *                     format: email
 *                     description: Email address (required for email registration)
 *                     example: john@example.com
 *                   password:
 *                     type: string
 *                     minLength: 6
 *                     description: Password (required for email registration, min 6 chars)
 *                     example: password123
 *                   mobile:
 *                     type: string
 *                     description: Mobile number (optional)
 *                     example: "1234567890"
 *                   countryCode:
 *                     type: string
 *                     description: Country code (e.g., +1, +91) - default +1
 *                     example: "+1"
 *                   source:
 *                     type: string
 *                     enum: [mobile, web]
 *                     default: mobile
 *                     description: Source of registration
 *               - title: Google Sign-In Registration
 *                 required:
 *                   - googleIdToken
 *                 properties:
 *                   googleIdToken:
 *                     type: string
 *                     description: Google ID token from mobile app
 *                     example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
 *                   name:
 *                     type: string
 *                     description: Full name (optional, will use Google name if not provided)
 *                     example: John Doe
 *                   mobile:
 *                     type: string
 *                     description: Mobile number (optional)
 *                     example: "1234567890"
 *                   countryCode:
 *                     type: string
 *                     description: Country code (e.g., +1, +91) - default +1
 *                     example: "+1"
 *                   source:
 *                     type: string
 *                     enum: [mobile, web]
 *                     default: mobile
 *                     description: Source of registration
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Registered successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         mobile:
 *                           type: object
 *                         role:
 *                           type: string
 *                           example: customer
 *                         avatar:
 *                           type: string
 *                         authProvider:
 *                           type: string
 *                           enum: [email, google]
 *                         source:
 *                           type: string
 *                           enum: [mobile, web]
 *                     accessToken:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                         expiresIn:
 *                           type: string
 *                           example: "30d"
 *       200:
 *         description: Google account linked to existing account
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */
router.post(
  '/register',
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
  register
)

/**
 * @swagger
 * /api/v1/livenotes/auth/login:
 *   post:
 *     summary: Login user for mobile app (Email/Mobile/Password or Google Sign-In)
 *     tags: [LiveNotes - Auth]
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             oneOf:
 *               - title: Email/Password Login
 *                 required:
 *                   - email
 *                   - password
 *                 properties:
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: john@example.com
 *                   password:
 *                     type: string
 *                     example: password123
 *               - title: Mobile/Password Login
 *                 required:
 *                   - mobile
 *                   - countryCode
 *                   - password
 *                 properties:
 *                   mobile:
 *                     type: string
 *                     example: "1234567890"
 *                   countryCode:
 *                     type: string
 *                     example: "+1"
 *                   password:
 *                     type: string
 *                     example: password123
 *               - title: Google Sign-In Login
 *                 required:
 *                   - googleIdToken
 *                 properties:
 *                   googleIdToken:
 *                     type: string
 *                     description: Google ID token from mobile app
 *                     example: "eyJhbGciOiJSUzI1NiIsImtpZCI6Ij..."
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logged in successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         mobile:
 *                           type: object
 *                         role:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                         authProvider:
 *                           type: string
 *                           enum: [email, google]
 *                         source:
 *                           type: string
 *                           enum: [mobile, web]
 *                     accessToken:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                         expiresIn:
 *                           type: string
 *                           example: "30d"
 *       400:
 *         description: Invalid request or missing required fields
 *       401:
 *         description: Invalid credentials or account deactivated
 *       404:
 *         description: User not found (for Google login)
 *       500:
 *         description: Server error
 */
router.post(
  '/login',
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
  login
)

export default router
