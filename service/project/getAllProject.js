import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"

export const getAllProjects = async(req) =>{
    try {
        const total_items = await prisma.project.count()
        if(total_items === 0) throw new AppError('No projects found', 404)

        const projects = await prisma.project.findMany({
            select:{
                id: true,
                title: true,
                tagline: true,
                short_desc: true,
                timeline: true,
                category: true,
                featured: true,
                order: true,
                thumbnail_url: true,
                live_url: true,
                features: true,
                tech_stack: true,
                createdAt: true,
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'asc' }
            ]
        })
        
        return {
            total_items: total_items,
            projects: projects
        }
    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get projects', 500)
    }
}