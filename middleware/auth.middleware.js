import { supabase } from "../utils/supabase.js"
import jwt from "jsonwebtoken"

export const jwtAuthMiddleware = async(req, res, next) => {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ message: "No token provided" })
    const token = auth.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Unauthorized" })
    try {
        const {data, error} = await supabase.auth.getUser(token)
        if (error || !data.user) {
            return res.status(401).json({ message: "Invalid token" })
        }
        req.user = data.user
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}

export const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' })
}