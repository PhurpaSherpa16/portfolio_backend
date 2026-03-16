import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const getSingleProject = async (req) => {
    try {
        const uid = req.user

        const { id } = req.params
        const project = await prisma.project.findUnique({
            where: { id },
            include: {
                features: true,
                process: true,
                tech_stack: {
                    include: {
                        tech_stack: true
                    }
                }
            }
        })

        if (!project) {
            throw new AppError('Project not found', 404)
        }

        return project
    } catch (error) {
        console.error('Error getting project:', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get project', 500)
    }
}
