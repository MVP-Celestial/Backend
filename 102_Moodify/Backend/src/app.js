const express = require("express")
const cookieParser = require("cookie-parser") //middleware
const cors = require("cors")


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

 /**
  * Routes
  */

 const authRoutes = require("./routes/auth.routes");
 app.use("/api/auth", authRoutes)

 const songRoutes = require("./routes/song.routes")
 app.use("/api/songs", songRoutes)



module.exports = app