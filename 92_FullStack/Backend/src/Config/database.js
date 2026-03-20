//code only to connect to db 

const mongoose = require("mongoose");

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Connected to mongodb")
    })
}

module.exports = connectToDb 