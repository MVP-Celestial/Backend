import { Router } from "express";
import { register, login, getMe } from "../controller/auth.controller.js";
import {verifyEmail} from "../controller/auth.controller.js";
import {registerValidation, loginValidation} from "../validators/auth.validator.js";
import {authUser} from "../middleware/auth.middleware.js"

const authRouter = Router();

authRouter.post("/register", registerValidation, register);

authRouter.post("/login", loginValidation, login);

authRouter.get("/get-me", authUser, getMe);

authRouter.get("/verify-email", verifyEmail);

export default authRouter

