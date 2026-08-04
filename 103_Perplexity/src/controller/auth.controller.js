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

    const emailVerificationToken = jwt.sign({
        email: user.email,

    },process.env.JWT_SECRET);

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        text: `Hi ${name},

Thank you for registering.`,
        html: `<p>Hi ${name},</p>
               <p>Thank you for registering.</p>
               <p>please verify your email by clicking the link below:</p>
               <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>`
    });

    res.status(201).json({
        success: true,
        user
    });
}

export async function verifyEmail(req, res) {

    const {token} = req.query;  //destructure the token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  //verifies the authenticity of a JSON Web Token (JWT) and extracts its underlying data payload using a secret key.

    
    

    const user = await userModel.findOne({email: decoded.email});

    if(!user) {
        return res.status(400).json({
            message: "Invalid Token",
            success: false,
            err: "user not found"
        })
    }

    user.isVerified = true;

    await user.save()

    const html = 
    `
    <h1>Email verified Successfully</h1>
    <p>Your Email has been verified. now you can login to your account</p>
    `

    return res.send(html);

    } catch (error) {
        return res.status(400).json({
            message: "Invalid Token",
        })
    }




}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        });
    }

    if(!password) {
        return res.status(400).json({
            success: false,
            message: "Invalid password"
        });
    }

    if (!user.isVerified) {
        return res.status(400).json({
            success: false,
            message: "Please verify your email before logging in"
        });
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email,
        username: user.username,
        
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie("token", token)

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            username: user.username,
        }
    });
    
}

export async function getMe(req, res) {
    const userId = req.user.id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    res.status(200).json({
        message: "User fetched successfully",
        success: true,
        user
    });
}