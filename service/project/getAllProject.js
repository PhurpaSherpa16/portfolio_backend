import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"

export const getAllProjects = async(req) =>{
    try {
        const {limit, page, start} = pagination(req, 10, 50)
        const total_items = await prisma.project.count()
        const total_pages = Math.ceil(total_items / limit)

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
            ],
            take: limit,
            skip: start,
        })

        if(projects.length === 0) return {
            total_items,
            total_pages,
            current_page_number: page,
            projects: [],
        }
        
        return {
            total_items: total_items,
            total_pages,
            current_page_number: page,
            projects: projects
        }
    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get projects', 500)
    }
}