import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const getSingleNotification = async (req) => {
    try {
        const { id } = req.params

        const result = await prisma.$transaction(async (tx) => {
            // 1. Fetch notification
            const notification = await tx.notification.findUnique({
                where: { id }
            })

            if (!notification) {
                throw new AppError('Notification not found', 404)
            }

            // 2. Mark notification as read (is_open: true)
            if (!notification.is_open) {
                await tx.notification.update({
                    where: { id },
                    data: { is_open: true }
                })
            }

            // 3. Handle dynamic entity fetching and marking as read
            let entityData = null;

            if (notification.entity_link === 'queries' || notification.entity_type === 'query') {
                // Mark linked query as read
                entityData = await tx.queries.update({
                    where: { id: notification.entity_id },
                    data: { isOpen: true },
                    select: {
                        id: true,
                        email: true,
                        message: true,
                        isOpen: true,
                        isFavourite: true,
                        createdAt: true
                    }
                })
            }

            if (!entityData) {
                throw new AppError('Linked entity data not found', 404)
            }

            return entityData
        })

        return result
    } catch (error) {
        console.log('Error', error)
        if (error.code === 'P2025') throw new AppError('Linked entity not found', 404)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get notification', 500)
    }
}
