import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"


export default async function createNotification(contact, message, entity_type, entity_id, entity_link, is_open){
    try {
        const notification = await prisma.notification.create({
            data: {
                contact,
                message,
                entity_type,
                entity_id,
                entity_link,
                is_open
            }
        })
        if(!notification){
            throw new AppError("Failed to create notification", 500)
        }
        return notification
    } catch (error) {
        console.log('Error in creating notification', error)
        if(error instanceof AppError) throw error
        throw new AppError(error.message || 'Internal Server Error', error.statusCode || 500)
    }
}