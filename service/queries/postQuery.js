import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import createNotification from "../notification/postNotification.js"

export const postQuery = async(req) =>{
    try {
        const {email, message, } = req.body

        if(!email || !message) throw new AppError('Email and message are required', 400)
        
        const post_query = await prisma.queries.create({
            data:{
                email: email.trim().toLowerCase(),
                message: message.trim().toLowerCase(),
                isOpen : false,
                isFavourite : false
            }
        })
        if(post_query){
            await createNotification(
                email,
                message,
                'query',
                post_query.id,
                'queries',
                false
            )
        }

        return
    } catch (error) {
        console.log('Error', error)
        if (error instanceof AppError) throw error
        throw new AppError('Failed to post queries', 500)
    }

}
    