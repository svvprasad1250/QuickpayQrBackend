import SibApiV3Sdk from "sib-api-v3-sdk";

const sendMail = async (to, subject, htmlContent, qrCodeBase64) => {
    try {
        const client = SibApiV3Sdk.ApiClient.instance;

        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.BREVO_API_KEY;

        const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

        const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, "");

        await tranEmailApi.sendTransacEmail({
            sender: {
                email: "venakataprasad5@gmail.com",
                name: "QuickPayQR"
            },
            to: [{ email: to }],
            subject: subject,
            htmlContent: htmlContent,
            attachment: [
                {
                    content: base64Data,
                    name: "qr.png"
                }
            ]
        });

        console.log("✅ Email sent successfully (Brevo)");
    } catch (error) {
        console.error("Brevo Error:", error.response?.body || error.message);
    }
};

export default sendMail;