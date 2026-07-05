const express = require("express") //this is needed to create the express.Router()
const userModel = require("../models/user.model")
const authRouter = express.Router() // creates a container/object to store all api routes
const bcrpyt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const authController = require("../controllers/auth.controller")
const {identifyUser} = require("../middlewares/auth.middleware")

authRouter.post('/register', authController.registerController)


authRouter.post('/login', authController.loginController)

/**
 * @route GET/api/auth/get-me
 * @description get the currently logged in user information.
 * @access private
 */

authRouter.get("/get-me",identifyUser, authController.getMeController)



module.exports = authRouter