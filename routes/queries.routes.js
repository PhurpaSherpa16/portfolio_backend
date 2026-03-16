import express from 'express'
import { getAllQueries, postQuery, getSingleQuery, deleteQuery } from '../controller/queries.controller.js'
import { uploadNone } from '../utils/multer.js'
import { jwtAuthMiddleware } from '../middleware/auth.middleware.js'


const router = express.Router()

router.get('/', jwtAuthMiddleware, getAllQueries)

router.post('/post-query', uploadNone, postQuery)

router.get('/:id', jwtAuthMiddleware, getSingleQuery)
router.delete('/delete/:id', jwtAuthMiddleware, deleteQuery)

export default router