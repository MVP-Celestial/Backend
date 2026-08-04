import { Router } from "express";
import { register, login } from "../controller/auth.controller.js";
import {verifyEmail} from "../controller/auth.controller.js";
import {registerValidation, loginValidation} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, register);

authRouter.post("/login", loginValidation, login);

authRouter.get("/verify-email", verifyEmail);

export default authRouter

