const followModel = require('../models/follow.model');
const userModel = require('../models/user.model');

async function followUserController(req, res) {

    const followerUsername = req.user.username
    const followeeUsername = req.params.username

    if(followerUsername === followeeUsername) {
        return res.status(400).json({
            message: "you cannot follow yourself"
        });
    };

    const isAlreadyFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername,
    })

    const isFolloweeExists = await userModel.findOne({
        username: followeeUsername
    })

    if(!isFolloweeExists) {
        return res.status(404).json({
            message: "User you are trying to follow does not exist."
        })
    }

    if(isAlreadyFollowing) {
        if(isAlreadyFollowing.status === "accepted") {
            return res.status(200).json({
                message: `You are already following ${followeeUsername}`,
                follow: isAlreadyFollowing
            })
        }

        if(isAlreadyFollowing.status === "pending") {
            return res.status(200).json({
                message: `Follow request already sent to ${followeeUsername}`,
                follow: isAlreadyFollowing
            })
        }

        isAlreadyFollowing.status = "pending"
        await isAlreadyFollowing.save()

        return res.status(200).json({
            message: `Follow request sent to ${followeeUsername}`,
            follow: isAlreadyFollowing
        })
    }

    const followRecord = await followModel.create({
        follower: followerUsername,
        followee: followeeUsername,
        status: "pending"
    })

    res.status(201).json({
        message: `Follow request sent to ${followeeUsername}`,
        follow: followRecord
    })

}

async function acceptFollowRequestController(req, res) {
    const followerUsername = req.params.username
    const followeeUsername = req.user.username

    const followRequest = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    if(followRequest.status === "accepted") {
        return res.status(200).json({
            message: `You have already accepted ${followerUsername}'s follow request`,
            follow: followRequest
        })
    }

    if(followRequest.status === "rejected") {
        return res.status(400).json({
            message: `This follow request from ${followerUsername} was already rejected`,
            follow: followRequest
        })
    }

    const follower = await userModel.findOne({ username: followerUsername })
    const followee = await userModel.findOne({ username: followeeUsername })

    if(!follower || !followee) {
        return res.status(404).json({
            message: "Follower or followee user not found"
        })
    }

    followRequest.status = "accepted"
    await followRequest.save()

    await userModel.findByIdAndUpdate(follower._id, {
        $addToSet: { following: followee._id }
    })

    await userModel.findByIdAndUpdate(followee._id, {
        $addToSet: { followers: follower._id }
    })

    res.status(200).json({
        message: `Accepted follow request from ${followerUsername}`,
        follow: followRequest
    })
}

async function rejectFollowRequestController(req, res) {
    const followerUsername = req.params.username
    const followeeUsername = req.user.username

    const followRequest = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(!followRequest) {
        return res.status(404).json({
            message: "Follow request not found"
        })
    }

    if(followRequest.status === "rejected") {
        return res.status(200).json({
            message: `You have already rejected ${followerUsername}'s follow request`,
            follow: followRequest
        })
    }

    const follower = await userModel.findOne({ username: followerUsername })
    const followee = await userModel.findOne({ username: followeeUsername })

    followRequest.status = "rejected"
    await followRequest.save()

    if(follower && followee) {
        await userModel.findByIdAndUpdate(follower._id, {
            $pull: { following: followee._id }
        })

        await userModel.findByIdAndUpdate(followee._id, {
            $pull: { followers: follower._id }
        })
    }

    res.status(200).json({
        message: `Rejected follow request from ${followerUsername}`,
        follow: followRequest
    })
}

async function getPendingFollowRequestsController(req, res) {
    const username = req.user.username

    const requests = await followModel.find({
        followee: username,
        status: "pending"
    })

    res.status(200).json({
        message: "Pending follow requests fetched successfully",
        requests
    })
}

async function unfollowUserController(req, res) {
    const followerUsername = req.user.username
    const followeeUsername = req.params.username


    const isUserFollowing = await followModel.findOne({
        follower: followerUsername,
        followee: followeeUsername
    })

    if(!isUserFollowing) {
        return res.status(200).json({
            message: `you are not following ${followeeUsername}`
        })
    }

    const follower = await userModel.findOne({ username: followerUsername })
    const followee = await userModel.findOne({ username: followeeUsername })

    await followModel.findByIdAndDelete(isUserFollowing._id)

    if(follower && followee) {
        await userModel.findByIdAndUpdate(follower._id, {
            $pull: { following: followee._id }
        })

        await userModel.findByIdAndUpdate(followee._id, {
            $pull: { followers: follower._id }
        })
    }

    res.status(200).json({
        message: `you have unfollowed ${followeeUsername}`
    })





}

module.exports = {
    followUserController,
    unfollowUserController,
    acceptFollowRequestController,
    rejectFollowRequestController,
    getPendingFollowRequestsController
}
