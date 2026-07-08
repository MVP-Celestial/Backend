const blacklist = require("../models/blacklist.model")
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const redis = require("../config/cache")



async function authUser(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({
            message: "token not provided"
        })
    }

    const isTokenBlacklisted = await redis.get(token)

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
        )

        req.user = decoded;

        next();
        
    } catch (error) {

        return res.status(401).json({
            message: "Invalid Token"
        })
        
    }
}

module.exports = {authUser}

// Its job is to answer one question:

// "Is this request coming from an authenticated (logged-in) user?"