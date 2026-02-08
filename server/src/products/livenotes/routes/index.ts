import { Router } from 'express'
import { protect } from "@/middleware/auth.js"
import { getDashboard } from '@/products/livenotes/controllers/dashboardController.js'

// Import product modules
import { authRoutes } from '@/products/livenotes/modules/auth/index.js'
import { noteRoutes } from '@/products/livenotes/modules/notes/index.js'

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
