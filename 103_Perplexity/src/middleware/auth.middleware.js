import jwt from "jsonwebtoken";

export function authUser(req, res, next) {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "No token Found, authorization denied",
        });
    }

    try { // in try and catch block we will verify the token and if it is valid then we will get the user id from the token and then we will find the user in the database and then we will attach the user to the request object and then we will call the next middleware
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Token is not valid",
        });
    }
}