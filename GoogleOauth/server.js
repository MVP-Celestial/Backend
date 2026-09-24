import { config } from "dotenv";
import express from "express"
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import morgan from "morgan";



config();

const app = express();

app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.send('hello world')
})

app.use(passport.initialize())

passport.use(new GoogleStrategy({ //default code when we want to setup google auth with passport
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},(_, __, profile, done)=> {
    return done(null, profile);
}))

app.get("/auth/google", 
    passport.authenticate("google", {scope: ["profile", "email"]}) //this code simply redirects the user to continue with google login/reg page
)
// scope basically means:

// "What information/permissions does our app request from the user's Google account?"

app.get("/auth/google/callback",
    passport.authenticate('google', {
        session:false,
        failureRedirect: '/'}),
    (req, res)=> {
        console.log(req.user)
        res.send("Google authentication success")
    }
 )


app.listen(3000, ()=>{
    console.log("app is running on port 3000")
}) 