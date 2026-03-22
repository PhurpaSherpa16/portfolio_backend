import express from 'express'
import { getAllProjects, getSingleProject, postProject, editProject, deleteProject, patchFeaturedProject, getFeaturedProjects } from '../controller/project.controller.js'
import { jwtAuthMiddleware } from '../middleware/auth.middleware.js'
import { singleImageUpload, uploadNone } from '../utils/multer.js'

const router = express.Router()

router.get('/', getAllProjects)
router.get('/:id', getSingleProject)
router.get('/get/featured', getFeaturedProjects)

// Protected routes
router.post('/post-project', jwtAuthMiddleware, singleImageUpload, postProject)
router.patch('/edit-project/:id', jwtAuthMiddleware, singleImageUpload, editProject)
router.delete('/delete-project/:id', jwtAuthMiddleware, deleteProject)
router.patch('/feature-project/:id', jwtAuthMiddleware, uploadNone, patchFeaturedProject)


export default router