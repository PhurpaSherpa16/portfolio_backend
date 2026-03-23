import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import { supabaseAuth } from "../../utils/supabase.js"

export const  signin_service = async (req) => {
    try {
        const {email, password} = req.body
        if(!email || !password) throw new AppError('Email and password are required.', 400)

        const {data, error} = await supabaseAuth.auth.signInWithPassword({email, password})
        console.log(req.body)
        if(error){
            console.log(error)
            switch (error.code) {
                case "invalid_email":
                case "invalid_credentials":
                case "user_not_found":
                case "wrong_password":
                    throw new AppError("Invalid email or password.", 400)
                case "email_not_confirmed":
                    throw new AppError("Email not confirmed. Please confirm your email.", 400)
                default:
                    throw new AppError("SignIn failed. Please try again.", 400)
            }
        }

        const userData = await prisma.user.findUnique({where : {id: data.user.id}, 
            select: {id: true, email: true, first_name: true, last_name: true, avatar_url: true, role: true, whatDoIDo: true}})

        if(!userData) throw new AppError('User not found.', 400)

        return {user: userData, token: data.session?.access_token}

    } catch (error) {
        if(error instanceof AppError) throw error
        throw new AppError(error.message || 'Signin failed, please try again.', 400)
    }
}
    
