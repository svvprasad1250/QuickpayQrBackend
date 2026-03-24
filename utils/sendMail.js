import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, htmlContent, qrCodeBase64) => {
    try {
        const msg = {
        to: to,
        from: {
            email: "venakataprasad5@gmail.com",
            name: "QuickPayQR",
        },
        subject: subject,
        html: htmlContent,
        attachments: [
            {
            content: qrCodeBase64.replace(/^data:image\/png;base64,/, ""),
            filename: "qr.png",
            type: "image/png",
            disposition: "inline",
            content_id: "paymentqr",
            },
        ],
        };

        await sgMail.send(msg);
        console.log("Email sent successfully");
    } catch (error) {
        console.error(
        "SendGrid Error:",
        error.response?.body || error.message
        );
    }
};

export default sendMail;