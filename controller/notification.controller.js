import { notificationService } from "../service/notification.services.js"
import CatchAsync from "../utils/catchAsync.js"

export const getAllNotification = CatchAsync(async (req, res) => {
    const result = await notificationService.getAllNotification(req)
    res.status(200).json({
        success: true,
        message: "All notifications fetched successfully",
        data: result
    })
})

export const getSingleNotification = CatchAsync(async (req, res) => {
    const result = await notificationService.getSingleNotification(req)
    res.status(200).json({
        success: true,
        message: "Notification fetched successfully",
        data: result
    })
})

export const deleteNotification = CatchAsync(async (req, res) => {
    await notificationService.deleteNotification(req)
    res.status(200).json({
        success: true,
        message: "Notification deleted successfully"
    })
})

export const clearAllNotifications = CatchAsync(async (req, res) => {
    await notificationService.clearAllNotifications(req)
    res.status(200).json({
        success: true,
        message: "All notifications cleared successfully"
    })
})