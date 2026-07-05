const express = require("express")
const postRouter = express.Router() // creates a container/object to store all api routes
const postController = require('../controllers/post.controller')
const multer = require("multer") // we use it to read the file on the server which is sent by the client 
const upload = multer({ storage:multer.memoryStorage() }) // multer is also a middleware
const { identifyUser } = require("../middlewares/auth.middleware")


/**
 * @route post /api/posts [protected]
 * @description: creates a post with content and image(optional)
 */
postRouter.post('/', upload.single("image"),identifyUser, postController.createPostController);


/**
 * @route GET /api/posts [protected]
 * @description: get all the posts created by the user
 */
postRouter.get('/',identifyUser,  postController.getPostController);


/**
 * @route GET /api/posts/details/:postId 
 * @description: return a detail about a specific post with its id
 */
postRouter.get('/details/:postId',identifyUser, postController.getPostDetialsController);

/**
 * @route POST /api/posts/like/:postId 
 * @description: Like a post
 */

postRouter.post('/like/:postId', identifyUser, postController.likePostController)
postRouter.post('/unlike/:postId', identifyUser, postController.unlikePostController)
/**
 * @route GET /api/posts/feed
 * @description: Gets all the post created in the db (only a loggedin user will be able to access)
 */

postRouter.get("/feed", identifyUser,postController.getFeedController)

module.exports = postRouter

