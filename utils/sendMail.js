import nodemailer from "nodemailer";

const sendMail = async(to,subject,htmlContent)=>{
    const transporter = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 587,
        secure:false,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        }
    })

    await transporter.sendMail({
        from: `"QuickPayQR" <${process.env.EMAIL_USER}> `,
        to,
        subject,
        html:htmlContent
    })
}

export default sendMail;