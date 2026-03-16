import CatchAsync from "../utils/catchAsync.js";
import { auth_service} from "../service/auth.services.js";

export const signup = CatchAsync(async (req, res, next) => {
    const result = await auth_service.signup_service(req)

    res.status(200).json({
        success: true,
        message: 'Signup successful',
        result: result
    })
})

export const signin = CatchAsync(async (req, res, next) => {
    const result = await auth_service.signin_service(req)
    res.status(200).json({
        status: 'success',
        success: true,
        message: 'Sign in successful',
        data: result
    })
        
})
    

export const google = CatchAsync(async (req, res, next) => {
    const result = await auth_service.google_service(req)
    res.redirect(result)
})
    