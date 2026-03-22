import express from 'express'
import { uploadNone } from '../utils/multer.js'
import { jwtAuthMiddleware } from '../middleware/auth.middleware.js'
import { getAllQueries, postQuery, getSingleQuery, deleteQuery, getUnreadQueryCount } from '../controller/queries.controller.js'


const router = express.Router()

router.post('/post-query', uploadNone, postQuery)
router.delete('/delete/:id', jwtAuthMiddleware, deleteQuery)

router.get('/', jwtAuthMiddleware, getAllQueries)
router.get('/:id', jwtAuthMiddleware, getSingleQuery)
router.get('/count/unread', jwtAuthMiddleware, getUnreadQueryCount)

export default router