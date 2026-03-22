import { supabaseAuth } from "../utils/supabase.js"

export const jwtAuthMiddleware = async(req, res, next) => {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ message: "No token provided" })
    const token = auth.split(" ")[1]
    if (!token) return res.status(401).json({ message: "Unauthorized" })
    try {
        const {data, error} = await supabaseAuth.auth.getUser(token)
        if (error || !data.user) {
            return res.status(401).json({ message: "Invalid token" })
        }
        req.user = data.user
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" })
    }
}