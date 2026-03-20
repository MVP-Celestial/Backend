require('dotenv').config()
const app = require("./src/app")
const connectToDb = require('./src/Config/database')

connectToDb() 

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})

//features of serverjs = running the server, connecting to db