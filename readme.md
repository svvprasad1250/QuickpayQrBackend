import Payment from "../models/paymentModel.js";
import sendMail from "../utils/sendMail.js";
import QRCode from "qrcode";
import path from "path";
export const createPayment = async (req, res) => {
    try {
        const { name, amount, email } = req.body;

        const upiLink = `upi://pay?pa=venkatprashu008@ybl&pn=Prasad&am=${amount}&cu=INR&tn=${name}`;

        const fileName = `${Date.now()}.png`;
        const filePath = path.join(process.cwd(), "public", "qrcodes", fileName);
        await QRCode.toFile(filePath,upiLink);
        const qrUrl = `https://griseous-radia-nonmortally.ngrok-free.dev/qrcodes/${fileName}`
        const payment = await Payment.create({
        name,
        amount,
        email,
        upiLink,
        qrCode:qrUrl
        });

        if (payment) {
        try {
            await sendMail(
            email,
            "Payment Request - QuickPayQR",
            `
            <h2>Hello ${name} Bhaiiiiii....👋</h2>

            <p>You need to pay <b>₹${amount}</b>.</p>
            <p>Scan this QR:</p>
            <img src="${qrUrl}" width="250" height="250" />
            <p>OR</p>

            <p>If QR not scanning, download and scan:</p>
            <a href="${qrUrl}" download
            style="padding:10px 15px;background:blue;color:white;text-decoration:none;">
            Download QR
            </a>

            <p>Click the button below to scan & pay:</p>
            <a href="${qrUrl}"
            style="padding:10px 20px;background:green;color:white;text-decoration:none;border-radius:5px;">
            Pay ₹${amount}
            </a>

            <p>Thank you Bhaiiii....🙏</p>
            `
            );

        } catch (err) {
            console.log("Email failed:", err.message);
        }

        res.status(201).json(payment);
        }

    } catch (error) {
        res.status(500)
        throw new Error("payment link generate fails")
    }
};

export const payRedirect = async (req, res) => {
    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
        return res.status(404).send("Payment not found");
    }

    res.send(`
    <html>
        <body style="text-align:center;margin-top:50px">

        <h2>Pay ₹${payment.amount}</h2>

        <a href="${payment.upiLink}"
            style="padding:15px 25px;background:green;color:white;
            text-decoration:none;border-radius:6px;font-size:18px;">
            Open PhonePe / GPay
        </a>

        <p>Click the button above to continue payment</p>

        </body>
    </html>
    `);
};