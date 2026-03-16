import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const deleteQuery = async (req) => {
    try {
        const { id } = req.params

        // Check if query exists
        const query = await prisma.queries.findUnique({
            where: { id }
        })

        if (!query) {
            throw new AppError('Query not found', 404)
        }

        await prisma.queries.delete({
            where: { id }
        })

        return
    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to delete query', 500)
    }
}
