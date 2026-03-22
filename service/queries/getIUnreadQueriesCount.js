import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const getUnreadQueryCount = async () => {
    try {
        const count = await prisma.queries.count({
            where: { isOpen: false }
        })
        return count
    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get unread query count', 500)
    }
}