const mongoose = require("mongoose")

const likeSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId, //is a specific configuration type used inside schema definitions to tell Mongoose that a field must store a 12-byte MongoDB ObjectId
        ref: "posts",
        required: [true, "Post id is required to like the post"] //This links the ID to another Mongoose model (presumably named Post)
    },

    username: {
        type: String,
        required: [true, "Username is required for liking the post"]
    }


},{
    timestamps: true
})

likeSchema.index({post: 1, user: 1}, {unique: true})

const likeModel = mongoose.model("likes", likeSchema)

module.exports = likeModel