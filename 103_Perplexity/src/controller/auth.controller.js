import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


export async function register(req, res) {

    const {username, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{email},{password}]

    })

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this username or email already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create({ username, email, password })

    await sendEmail({
        to: email,
        subject: "Welcome to perplexity",
        text: `Hi ${username}, \n\n Thankyou for registering at perplexity. We are excited to have you on board\n\nBest regards,\nThe perplexity Team`,
        html: `<p>Hi ${username}, </p>
        <p>Thankyou for registering at <strong>Perplexity</strong>. We're excited to have you on board</p>
        <p>Best regards, <br>The perplexity team</br></p>`
    })

    res.status(201).json({
        message: "user registered successfully",
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }

    })

}