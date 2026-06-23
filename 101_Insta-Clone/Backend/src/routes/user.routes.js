const express = require("express")
const userController = require("../controllers/user.controller");
const { identifyUser } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter.post("/follow/:username", identifyUser, userController.followUserController)

userRouter.get("/follow-requests", identifyUser, userController.getPendingFollowRequestsController)

userRouter.patch("/follow/:username/accept", identifyUser, userController.acceptFollowRequestController)

userRouter.patch("/follow/:username/reject", identifyUser, userController.rejectFollowRequestController)

userRouter.post("/unfollow/:username", identifyUser, userController.unfollowUserController)







module.exports = userRouter;
