import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, htmlContent) => {
    try {
        const msg = {
        to,
        from: "venakataprasad5@gmail.com",
        subject,
        html: htmlContent,
        };

        await sgMail.send(msg);
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
    }
};

export default sendMail;