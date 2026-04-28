const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
     
    name:String,
    email: {
        type:String,
        unique:[true, "User already has signed up!!"]
    },
    password:String
})

const userModel = mongoose.model("userz", userSchema)

module.exports = userModel

