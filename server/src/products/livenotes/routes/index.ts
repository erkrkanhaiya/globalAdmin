import { Router } from 'express'
import { protect } from "../../../../middleware/auth.js'
import { getDashboard } from '../controllers/dashboardController.js'

// Import product modules
import { authRoutes } from '../modules/auth/index.js'
import { noteRoutes } from '../modules/notes/index.js'

const router = Router()

// Public routes (auth module handles Basic Auth)
router.use('/auth', authRoutes)

// Protected routes (require JWT)
router.use(protect)

// Dashboard
router.get('/dashboard', getDashboard)

// Product modules routes
router.use('/notes', noteRoutes)

// Add more module routes here
// router.use('/collaborations', collaborationRoutes)
// etc.

export default router
