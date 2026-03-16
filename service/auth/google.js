import { supabase } from "../../utils/supabase.js"

export const google_service = async (req) => {
    const redirectTo = 'https://phurpasherpa-portfolio.netlify.app/'
    const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo }
        })

    if (error) throw new Error(error.message)

    return data.url
}
