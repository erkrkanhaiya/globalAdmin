import { Router } from 'express'
import { authRoutes } from '../modules/auth/index.js'
import { adminRoutes } from '../modules/admin/index.js'
import { userRoutes } from '../modules/user/index.js'

const router = Router()

// Standard auth routes (public)
router.use('/auth', authRoutes)

// Admin routes - All admin endpoints under /admin/
// Example: /api/v1/admin/dashboard, /api/v1/admin/users, /api/v1/admin/agents, etc.
router.use('/admin', adminRoutes)

// User routes - All user endpoints under /user/
// Example: /api/v1/user/profile, /api/v1/user/agents, /api/v1/user/properties, etc.
router.use('/user', userRoutes)

export default router
