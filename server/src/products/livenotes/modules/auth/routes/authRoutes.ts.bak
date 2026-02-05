import { Router } from 'express'
import { basicAuth } from "../../../../middleware/basicAuth.js'
import { login } from '../controllers/authController.js'

const router = Router()

router.post('/login', basicAuth, login)

export default router
