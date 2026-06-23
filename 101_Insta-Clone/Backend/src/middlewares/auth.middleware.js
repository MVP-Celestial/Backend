const jwt = require('jsonwebtoken')
async function identifyUser(req, res, next) { // request ke undar se token nikaldega aur token ke undar data ko read krke ye batayega ki request kis user ne ki hai

     const token = req.cookies.token
    
        if(!token) {
            return res.status(401).json({
                message: "Token not provided, Unauthorized Access"
            })
        }
    
        let decoded
    
        try {
    
            decoded = jwt.verify(token, process.env.JWT_SECRET) //decoded me wo data ayega jo data humne token create krte time use kiya tha (i.e: user id in const token)
            
        } catch (error) {
            return res.status(401).json({
                message: "User not authorized"
            })
            
        }

        req.user = decoded

        next()
}

module.exports={identifyUser}
