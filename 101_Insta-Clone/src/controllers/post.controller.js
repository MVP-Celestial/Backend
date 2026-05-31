const postModel = require('../models/post.model') //imported post schema
const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) { //api logic for creating post

    console.log(req.body, req.file)

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

          
    console.log(decoded)
    
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'), //entire file's content is inside buffer its an array
        fileName: "Suske",
        folder: "Insta-Clone"

        //this code transfer the file from backend server to cloud server
        
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: decoded.id
    })
    
    res.status(201).json({
        message: "Post created Successfully",
        post
    })


}

async function getPostController(req,res) {  //this function helps to fetch the users their own respective posts

    const token = req.cookies.token //storing the token

    let decoded;

    try {
        
       decoded = jwt.verify(token, process.env.JWT_SECRET);  //verifies the token

    } catch (error) { //if token is invalid this block of code is executed

        return res.status(401).json({
            message: "Token Invalid"
        })
        
    }

    const userId = decoded.id //stores the id of the user that is requesting the posts.

    const posts = await postModel.find({
        user: userId
    })

    res.status(200).json({
        message: "Posts fetched Successfully",
        posts
    })


}

async function getPostDetialsController(req,res) { // used to validate posts that only the real user access the particular post
    const token = req.cookies.token
    
    if(!token) {
        return res.status(401).json({
            message: "Unauthorized Access"
        })
    }

    let decoded;

    try {

        decoded = jwt.verify(token, process.env.JWT_SECRET)

    } catch (error) {

        res.status(401).json({
            message: "Invalid Token"
        })
        
    }

    const userId = decoded.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({
            message: "post not found"
        })
    }

    const isValidUser = post.user === userId

    if(!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content"
        })
    }

    return res.status(200).json({
        message: "Post Fetched Successfully",
        post
    })
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetialsController
}