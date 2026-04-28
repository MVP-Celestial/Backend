require("dotenv").config()  // config method helps us to access variables inside env

const connectToDb = require("./src/config/database")

const app = require("./src/app")

connectToDb()




app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})