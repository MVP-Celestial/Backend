const userModel = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {

    const {username, email, password} = req.body;

    const isAlreadyRegistered = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]

    })

    if(isAlreadyRegistered) {
        return res.status(400).json({
            message: "User with the same email has already registered"
        })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        username: user.username
    },process.env.JWT_SECRET,{
        expiresIn: "3d"
    })

    res.cookie("token", token)

    return res.status(201).json({
       message: "User registered Successfully",
       user: {
        id: user._id,
        username: user.username,
        email: user.email
       } 
    })

}

async function loginUser(req, res) {
    const {email, password, username} = req.body;

    const user = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    })

    if(!user) {
        return res.status(400).json({
            message: "Invalid Credentials" //instead of user not found we give invalide credentials
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid credentials"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d"
        }
    )

    res.cookie("token", token)

    return res.status(201).json({
        message: "User logged in Successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
    
}

module.exports = {registerUser, loginUser}

