import express from 'express'
import { getAllProjects } from '../controller/project.controller.js'
import { jwtAuthMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get('/', jwtAuthMiddleware, getAllProjects)

export default router