import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, htmlContent, qrCodeBase64) => {
    try {
        const msg = {
        to,
        from: {
            email: "venakataprasad5@gmail.com",
            name: "QuickPayQR"
        },
        subject,
        html: htmlContent,
        attachments: [
            {
            content: qrCodeBase64.split("base64,")[1],
            filename: "payment-qr.png",
            type: "image/png",
            disposition: "inline",
            content_id: "paymentqr"
            }
        ]
        };

        await sgMail.send(msg);
    } catch (error) {
        console.error("SendGrid error:", error.response?.body || error.message);
    }
};

export default sendMail;