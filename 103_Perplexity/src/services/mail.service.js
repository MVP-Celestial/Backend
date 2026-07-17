import nodemailer from "nodemailer"

//transporter connects smtp server with webserver


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID
    }
})

transporter.verify()
.then(()=>{console.log("email transporter is ready to send emails");})
.catch((err)=>{console.log('email transporter verification failed:', err);})

export async function sendEmail({to, subject, html, text}) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        html,
        text
    };



}
