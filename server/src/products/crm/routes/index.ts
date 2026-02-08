import { Router } from 'express'
import { protect } from "@/middleware/auth.js"
import { basicAuth } from "@/middleware/basicAuth.js"
import { login } from '@/products/crm/controllers/authController.js'

const router = Router()

// Public routes (require Basic Auth)
router.post('/login', basicAuth, login)

// Protected routes (require JWT)
router.use(protect)

// Add more routes here
// router.get('/customers', getCustomers)
// router.post('/leads', createLead)
// etc.

export default router
