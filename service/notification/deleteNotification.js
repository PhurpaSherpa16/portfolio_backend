import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const deleteNotification = async (req) => {
    try {
        const { id } = req.params

        const notification = await prisma.notification.findUnique({
            where: { id }
        })

        if (!notification) {
            throw new AppError('Notification not found', 404)
        }

        await prisma.notification.delete({
            where: { id }
        })

        return
    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to delete notification', 500)
    }
}
