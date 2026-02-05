import { Router } from 'express'
import { protect } from "../../../../middleware/auth.js'
import { getDashboard } from '../controllers/dashboardController.js'

// Import all product modules
import { default as authRoutes } from '../modules/auth/routes/authRoutes.js'
import { default as userRoutes } from '../modules/user/routes/userRoutes.js'
import { default as adminRoutes } from '../modules/admin/routes/adminRoutes.js'
import { default as orderRoutes } from '../modules/orders/routes/orderRoutes.js'
// Import other modules as needed
// import { default as agentRoutes } from '../modules/agent/routes/agentRoutes.js'
// import { default as propertyRoutes } from '../modules/property/routes/propertyRoutes.js'
// import { default as supportRoutes } from '../modules/support/routes/supportRoutes.js'
// import { default as paymentRoutes } from '../modules/payment/routes/paymentRoutes.js'
// import { default as auctionRoutes } from '../modules/auction/routes/auctionRoutes.js'

const router = Router()

// Public routes (require Basic Auth)
router.use('/auth', authRoutes)

// Protected routes (require JWT)
router.use(protect)

// Dashboard
router.get('/dashboard', getDashboard)

// Product modules routes
router.use('/user', userRoutes)
router.use('/admin', adminRoutes)
router.use('/orders', orderRoutes)

// Add more module routes here as needed
// router.use('/agents', agentRoutes)
// router.use('/properties', propertyRoutes)
// router.use('/support', supportRoutes)
// router.use('/payments', paymentRoutes)
// router.use('/auctions', auctionRoutes)

export default router
