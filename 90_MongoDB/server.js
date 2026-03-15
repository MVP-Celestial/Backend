const app = require("./src/app")

const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect("uri")
    .then(()=>{
        console.log("Connected to Mongodb")
    })
} //connects express server to mongodb 

connectToDb()

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})

