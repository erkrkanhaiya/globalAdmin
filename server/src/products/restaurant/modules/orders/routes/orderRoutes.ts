import { Router } from 'express'
import { protect } from "@/middleware/auth.js"
import { getOrders, createOrder } from '../controllers/orderController.js'

const router = Router()

// All routes require authentication
router.use(protect)

router.get('/', getOrders)
router.post('/', createOrder)

export default router
