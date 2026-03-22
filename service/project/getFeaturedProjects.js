import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const getFeaturedProjects = async() =>{
    try {
        const response = await prisma.project.findFirst({
            where: {featured: true},
            select: {
                id: true,
                title: true,
                tagline: true,
                timeline: true,
                category: true,
                thumbnail_url: true,
                live_url: true,
                github_url: true,
                features: true,
                tech_stack: {
                    select: {
                        tech_stack: true
                    }
                }
            }
        })

        return response
    } catch (error) {
        console.error('Error getting project:', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get project', 500)
    }
}