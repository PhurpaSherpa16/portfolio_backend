import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const clearAllNotifications = async (req) => {
    try {
        await prisma.notification.deleteMany({})
        return
    } catch (error) {
        console.log('Error', error)
        throw new AppError('Failed to clear notifications', 500)
    }
}
