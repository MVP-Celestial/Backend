import { Router } from "express";
import { register } from "../controller/auth.controller.js";
import registerValidation from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", registerValidation, register);

export default authRouter