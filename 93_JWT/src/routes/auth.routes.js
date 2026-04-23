const express = require("express")
const jwt = require("jsonwebtoken")

const authRouter = express.Router() //if we want to create api in file other than app.js at that time we use router

const userModel = require("../models/user.model")

authRouter.post('/register', async (req,res)=>{
    const {email,name,password} = req.body


    const userExist = await userModel.findOne({email})

    if(userExist) {
        return res.status(400).json({
            message: "User already exists!"
        })
    }

    const user = await userModel.create({
        email, password, name 
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email

    },
    process.env.JWT_SECRET

)

 res.cookie("jwt_cookie")

    res.status(201).json({
        message:"User registered successfully",
        user,
        token

    })
})

module.exports = authRouter  