import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import { pagination } from "../../utils/pagination.js"

export const getAllQueries = async(req) =>{
    try {
        const {limit, page, start} = pagination(req, 10, 50)
        const total_items = await prisma.queries.count()
        const total_pages = Math.ceil(total_items / limit)

        const client_queries = await prisma.queries.findMany({
            select: {
                id: true,
                email: true,
                message: true,
                isOpen: true,
                isFavourite: true,
                createdAt: true
            },
            orderBy: [
                {isOpen : 'asc'}, 
                {isFavourite : 'desc'},
                {createdAt: 'desc'}
            ],
            take: limit,
            skip: start
        })

        return {
            total_items,
            total_pages,
            current_page_number: page,
            data: client_queries
        }

    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to get queries', 500)
    }
}
    