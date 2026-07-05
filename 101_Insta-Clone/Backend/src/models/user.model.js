const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: [true, "Username already exists!"],
        required: [ true, "Username is required"]
    },

    email:{
        type: String,
        unique: [true, "Email already exists!"],
        required: [true, "Email is required"]
    },

    password: {
        type: String,
        required: [true, "Password is required"],
        select: false //stops reading password from db (used to avoid sending passw in response)
    },

    bio: String,

    profileImage:{
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/0/03/Twitter_default_profile_400x400.png",
    },

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "insta-users"
    }],

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "insta-users"
    }]
})

const userModel = mongoose.model('insta-users', userSchema ) //insta-users naam se save hoga in db


module.exports = userModel;
