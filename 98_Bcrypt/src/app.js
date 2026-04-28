const express = require("express")

const authRouter = require("./routes/auth.routes")

const cookieParser = require("cookie-parser")

const app = express()



app.use(express.json()) //enables us to read data in req.body
app.use(cookieParser())

app.use("/api/auth", authRouter)







module.exports = app