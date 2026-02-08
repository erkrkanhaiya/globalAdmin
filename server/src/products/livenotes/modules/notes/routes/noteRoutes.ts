import { Router } from 'express'
import { protect } from "@/middleware/auth.js"
import { getNotes, createNote } from '@/products/livenotes/modules/noteController.js'

const router = Router()

router.use(protect)

router.get('/', getNotes)
router.post('/', createNote)

export default router
