import prisma from "../../lib/prisma.js"
import AppError from "../../utils/appError.js"
import { supabase } from "../../utils/supabase.js"

export const signup_service = async (req) => {
    try {
        const {email, password, first_name, last_name} = req.body
        if(!email || !password) throw new AppError('Email and password are required.', 400)
        
        const {data, error} = await supabase.auth.signUp({email, password})
        if(data.user){
            const {error: profileError} = await prisma.user.create({
                data :{
                    id: data.user.id,
                    email: data.user.email,
                    first_name: first_name || 'admin',
                    last_name: last_name || 'admin',
                    role: 'admin',
                    isActive: true,
                    avatar_url: '',
                }
            })
            if(profileError){
                console.log('profileError:', profileError)
                throw new AppError(profileError.message, 400)
            }
        }
        if(error){
            console.log('signup error :', error)
            throw new AppError(error.message, 400)
        }
        // no neet to generate token, supabase.auth.signUp -> already access token can use it.
        return { token: data.session?.access_token, message: 'Signup successful'}

    } catch (error) {
        console.log('erro in signup_service:', error)
        if(error instanceof AppError) throw error
        throw new AppError(error, 400)
    }
}
    
