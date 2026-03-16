import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const getSingleQuery = async (req) => {
    try {
        const { id } = req.params

        const query = await prisma.queries.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                message: true,
                isOpen: true,
                isFavourite: true,
                createdAt: true
            }
        })

        if (!query) {
            throw new AppError('Query not found', 404)
        }

        // Mark as open if not already
        if (!query.isOpen) {
            await prisma.queries.update({
                where: { id },
                data: { isOpen: true }
            })
            query.isOpen = true
        }

        return query

    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get query', 500)
    }
}
