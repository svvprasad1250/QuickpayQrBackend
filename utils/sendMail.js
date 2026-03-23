import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, htmlContent) => {
    const msg = {
        to,
        from: "venakataprasad5@gmail.com", // must be verified in SendGrid
        subject,
        html: htmlContent,
    };

    await sgMail.send(msg);
};

export default sendMail;