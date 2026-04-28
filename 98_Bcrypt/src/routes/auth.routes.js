const express = require("express")
const jwt = require("jsonwebtoken")
const authRouter = express.Router() //if we want to create api in file other than app.js at that time we use router
const userModel = require("../models/user.model")
const crypto = require("crypto")

authRouter.post('/register', async (req,res)=>{
    const {email,name,password} = req.body


    const userExist = await userModel.findOne({email})

    if(userExist) {
        return res.status(400).json({
            message: "User already exists!"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const user = await userModel.create({
        email, password: hash, name 
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

authRouter.post('/protected', async (req,res)=>{
    console.log(req.cookies);

    res.status(200).json({
        message: "This is a protected route"
    })
})

authRouter.post('/login', async (req,res)=>{

    const {email, password} = req.body

    const user = await userModel.findOne({email})

    if(!user) {
        return res.status(404).json({
            message: "User with this mail does not exist"
        })
    }

    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex")

    if(!isPasswordMatched) {
        return res.status(404).json({
            message: "Invalid Password"
        })
    }

    const token = jwt.sign({
        id: user._id
    }, process.env.JWT_SECRET)

    res.cookie("jwt_token", token)

    res.status(200).json({
        message: "User Logged In",
        user,
    })


})



module.exports = authRouter