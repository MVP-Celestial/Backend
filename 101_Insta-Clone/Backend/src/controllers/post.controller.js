const postModel = require('../models/post.model') //imported post schema
const ImageKit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")
const likeModel = require('../models/like.model')

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req, res) { //api logic for creating post

    console.log(req.body, req.file)
    
    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'), //entire file's content is inside buffer its an array
        fileName: "Suske",
        folder: "Insta-Clone"

        //this code transfer the file from backend server to cloud server
        
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: req.user.id
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

    const userId = req.user.id //stores the id of the user that is requesting the posts.

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

        return res.status(401).json({
            message: "Invalid Token"
        })
        
    }

    const userId = req.user.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({
            message: "post not found"
        })
    }

    const isValidUser = post.user.toString() === userId

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

async function likePostController(req, res) {
    const username = req.user.username
    const postId = req.params.postId

    const post = await postModel.findById(postId)

    if(!post) {
        return res.status(404).json({
            message: "Post not found"
        })
    }

    const like = await likeModel.create({
        post: postId,
        user: username

    })

    return res.status(200).json({
        message: "Post Liked Successfully",
        like
    })
}

async function unlikePostController(req, res) {
    const postId = req.params
    const username = req.user.username
    const isLiked = await likeModel.findOne({
        post: postId,
        user: username
    })

    if(!isLiked) {
        return res.status(400).json({
            message: "Post didnt like"
        })
    }

    await likeModel.findOneAndDelete({_id: isLiked._id})
    
    return res.status(200).json({
        message: "Post Unliked Successfully"
    })
}

async function getFeedController(req, res) {
    const posts = await Promise.all(
        (await postModel.find().populate("user").lean()).map(async (post) => {
            const isLiked = await likeModel.findOne({ 
                user: req.user.username,
                post: post._id
            })
            post.isLiked = Boolean(isLiked)

            return post 
        })
    )

    res.status(200).json({
        message: "Posts Fetched Successfully",
        posts
    })
}

module.exports = {
    createPostController,
    getPostController,
    getPostDetialsController,
    likePostController,
    getFeedController,
    unlikePostController
}
