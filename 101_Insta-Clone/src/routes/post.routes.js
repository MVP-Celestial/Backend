const express = require("express")
const postRouter = express.Router() // creates a container/object to store all api routes
const postController = require('../controllers/post.controller')
const multer = require("multer") // we use it to read the file on the server which is sent by the client 
const upload = multer({ storage:multer.memoryStorage() }) // multer is also a middleware




postRouter.post('/', upload.single("image"), postController.createPostController);

postRouter.get('/',  postController.getPostController);

postRouter.get('/details/:postId', postController.getPostDetialsController);

module.exports = postRouter

