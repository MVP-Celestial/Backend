const express = require("express") //this is needed to create the express.Router()
const userModel = require("../models/user.model")
const authRouter = express.Router() // creates a container/object to store all api routes
const bcrpyt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authController = require("../controllers/auth.controller")

authRouter.post('/register', authController.registerController)


authRouter.post('/login', authController.loginController)

module.exports = authRouter