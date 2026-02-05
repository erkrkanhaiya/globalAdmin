import { Router } from 'express'
import { protect } from "../../../../middleware/auth.js'
import { basicAuth } from "../../../../middleware/basicAuth.js'
import { login } from '../controllers/authController.js'

const router = Router()

// Public routes (require Basic Auth)
router.post('/login', basicAuth, login)

// Protected routes (require JWT)
router.use(protect)

// Add more routes here
// router.post('/send-message', sendMessage)
// router.get('/messages', getMessages)
// etc.

export default router
