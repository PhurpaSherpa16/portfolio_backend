import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import { deleteFromSupabase } from "../../utils/supabaseUpload.js";

export const deleteProject = async (req) => {
    const bucketName = "project_images";
    const folders = ['main_image', 'thumbnail_image']
    let images = []
    try {
        const { id } = req.params

        const fetching_image_details = await prisma.project.findUnique({
            where: { id },
            select: { image_url: true }
        })

        if(fetching_image_details.image_url){
            const image_name = decodeURIComponent(fetching_image_details.image_url.split('/').pop())
            images = folders.map(folder => `${folder}/${image_name}`)
        }

        if(images.length > 0){
            await deleteFromSupabase(bucketName, images)
        }

        const deletedProject = await prisma.project.delete({where: { id }})

        return deletedProject

    } catch (error) {
        console.error('Error deleting project:', error)
        if (error.code === 'P2025') throw new AppError('Project not found', 404)
        throw new AppError('Failed to delete project', 500)
    }
}
