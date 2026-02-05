import { Router } from 'express'
import {
  register,
  login,
  getMe,
  validateRegister,
  validateLogin,
} from '../controllers/authController.js'
import { protect } from "../../../../middleware/auth.js'
import { basicAuth } from "../../../../middleware/basicAuth.js'
import { validate } from "../../../../middleware/validator.js'
import { authLimiter } from '../../../../config/rateLimit.js'

const router = Router()

// Public routes (require Basic Auth)
router.post('/register', basicAuth, authLimiter, validate(validateRegister), register)
router.post('/login', basicAuth, authLimiter, validate(validateLogin), login)

// Protected routes (require JWT)
router.get('/me', protect, getMe)

export default router
