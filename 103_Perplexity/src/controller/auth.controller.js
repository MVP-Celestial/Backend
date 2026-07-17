import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function register(req, res) {

    const {username, email, password} = req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or: [{email},{password}]

    })

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "User with this username or email already exists",
            success: false,
            err: "user already exists"
        })
    }

    const user = await userModel.create

}