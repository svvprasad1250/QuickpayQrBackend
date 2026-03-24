import Payment from "../models/paymentModel.js";
import sendMail from "../utils/sendMail.js";
import QRCode from "qrcode";

export const createPayment = async (req, res) => {
    try {
        const { name, amount, phone } = req.body;

        const upiLink = `upi://pay?pa=venkatprashu008@ybl&pn=Prasad&am=${amount}&cu=INR&tn=${name.replace(/\s/g,"-")}`;

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const qrCode = await QRCode.toDataURL(upiLink);

        const payment = await Payment.create({
        name,
        amount,
        phone,
        upiLink,
        qrCode,
        expiresAt
        });

        const payUrl = `https://quickpayqrbackend.onrender.com/api/payments/pay/${payment._id}`;

        // WhatsApp message
        const message = encodeURIComponent(
        `Hi ${name} 👋\n\nPlease pay ₹${amount}\n\nClick the link below to pay:\n${payUrl}\n\nThis link expires in 1 hour`
        );

        const whatsappLink = `https://wa.me/${phone}?text=${message}`;

        res.status(201).json({
        payment,
        payUrl,
        whatsappLink
        });

    } catch (error) {
        res.status(500).json({ message: "Payment link generation failed" });
    }
};

export const payRedirect = async (req, res) => {

    const { id } = req.params;

    const payment = await Payment.findById(id);

    if (!payment) {
        return res.status(404).send("Payment not found");
    }

    if (payment.expiresAt < new Date()) {
        return res.send("<h2>Payment Link Expired</h2>");
    }

    res.send(`
    <html>
    <body style="text-align:center;margin-top:50px;font-family:sans-serif">

    <h2>Pay ₹${payment.amount}</h2>

    <p>Scan QR to Pay</p>

    <img src="${payment.qrCode}" width="250"/>

    <br/><br/>

    <a href="${payment.upiLink}"
    style="padding:15px 25px;background:green;color:white;
    text-decoration:none;border-radius:6px;font-size:18px;">
    Open PhonePe / GPay
    </a>

    </body>
    </html>
    `);
};