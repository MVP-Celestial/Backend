import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";


export async function register(req, res) {

    const { name, username, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{ email }, { username }]
    });

    if (isUserAlreadyExists) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    const user = await userModel.create({
        name,
        username,
        email,
        password
    });

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        text: `Hi ${name},

Thank you for registering.`,
        html: `<p>Hi ${name},</p>
               <p>Thank you for registering.</p>`
    });

    res.status(201).json({
        success: true,
        user
    });
}