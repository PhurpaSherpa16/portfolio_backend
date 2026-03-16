import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const getAllNotification = async (req) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        return notifications
    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get notifications', 500)
    }
}