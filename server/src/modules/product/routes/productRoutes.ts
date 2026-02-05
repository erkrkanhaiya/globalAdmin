import { Router } from 'express'
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
} from '../controllers/productController.js'
import { protect, authorize } from '../../../middleware/auth.js'

const router = Router()

// All routes require authentication
router.use(protect)

// Get all products (for category selection)
router.get('/', getProducts)

// Get single product
router.get('/:slug', getProduct)

// Create/Update products (Super Admin only)
router.post('/', authorize('super_admin', 'admin'), createProduct)
router.put('/:id', authorize('super_admin', 'admin'), updateProduct)

export default router
