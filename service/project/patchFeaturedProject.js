import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const patchFeaturedProject = async (req) => {
    try {
        const { id } = req.params
        const { featured } = req.body

        const result = await prisma.$transaction(async (item) => {
            // If the user wants to set this project as featured
            if (featured === true || featured === 'true') {
                // First, find and un-feature any currently featured project
                await item.project.updateMany({
                    where: { featured: true },
                    data: { featured: false }
                })
            }

            // Then, update the target project
            const updatedProject = await tx.project.update({
                where: { id },
                data: { featured: (featured === true || featured === 'true') }
            })

            return updatedProject.id
        })

        return result
    } catch (error) {
        if (error.code === 'P2025') {
            throw new AppError('Project not found', 404);
        }
        throw new AppError(error.message || 'Failed to update featured status', error.statusCode || 500)
    }
}