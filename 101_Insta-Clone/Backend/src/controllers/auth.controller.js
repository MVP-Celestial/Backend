const express = require("express")
const userModel = require("../models/user.model")
const authRouter = express.Router() // creates a container/object to store all api routes
const crypto = require("crypto")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")



async function registerController (req,res) {
    const { username , email , password , bio , profileImage} = req.body

    const isUsernameExist = await userModel.findOne({username})

    // if(isUsernameExist) {
    //     return res.status(409).json({
    //         message: "Username Already Exists"
    //     })
    // }

    // const isEmailExist = await userModel.findOne({email})
    
    // if(isEmailExist) {
    //     return res.status(409).json({
    //         message: "Email Already Exists!"
    //     })
    // }

    const isUserAlreadyExist = await userModel.findOne({
        $or:[
            {username},
            {email}   //email from database
        ]
    })

    if(isUserAlreadyExist) {
        return res.status(409).json({
            message: "User already exists" + 
            
            (isUserAlreadyExist.email === email ? "Email Already Exists" : "Username Alread Exists")
        })
    }

    const hash = await bcrypt.hash(password, 10)
    
    const user = await userModel.create({
        username,
        email,
        bio,
        profileImage,
        password: hash
    })

    const token = jwt.sign(
        {
            //data inside this object should be unique and user related data hona chahiye
            //payload
            id: user._id,
            username: user.username      

        },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}

    )

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered Sucessfully",
        user: {
            email: user.email,
            username: user.username,
            bio: user.bio,
            profileImage: user.profileImage,
        }

    })



}

async function loginController(req, res) {
    const {username, email, password} = req.body;

    const user = await userModel.findOne({
        $or:[
            {
                username: username
            },
            {
                email: email
            }
        ]
    })

    if(!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if(!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid Password"
        })
    }

    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User Logged In Successfully",
        user: {
            username: user.username,
            email: user.email,
            bio: user.bio, 
            profileImage: user.profileImage

        }
    })
}



module.exports = {
    registerController,
    loginController
}
