const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({

    caption: {
        type: String,
        default: "",
         
    },

    imgUrl: {
        type: String,
        required: [true, "img url is required for creating a post"]
    },

    user: {
            type:   mongoose.Schema.Types.ObjectId,
            ref: "insta-users",
            required: [true, "User id is required for creating a post"]
    }


})


const postModel = mongoose.model("posts", postSchema)  //create a collection named "posts" in the db with postSchema as its data

module.exports = postModel
