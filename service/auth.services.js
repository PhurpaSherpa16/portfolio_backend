import { google_service } from "./auth/google.js";
import { signup_service } from "./auth/signup.js";
import { signin_service } from "./auth/signin.js";

export const auth_service = {
    signup_service,
    google_service,
    signin_service
}