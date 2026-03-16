import express from 'express'
import { jwtAuthMiddleware } from '../middleware/auth.middleware.js'
import { 
    getAllNotification, 
    getSingleNotification, 
    deleteNotification, 
    clearAllNotifications 
} from '../controller/notification.controller.js'

const router = express.Router()

router.get('/', jwtAuthMiddleware, getAllNotification)
router.get('/:id', jwtAuthMiddleware, getSingleNotification)
router.delete('/delete/:id', jwtAuthMiddleware, deleteNotification)
router.delete('/clear-all', jwtAuthMiddleware, clearAllNotifications)

export default router