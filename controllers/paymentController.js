import Payment from "../models/paymentModel.js";
import sendMail from "../utils/sendMail.js";
import QRCode from "qrcode";

export const createPayment = async (req, res) => {
    try {
        const { name, amount, email } = req.body;

        const upiLink = `upi://pay?pa=venkatprashu008@ybl&pn=Prasad&am=${amount}&cu=INR&tn=${name.replace(/\s/g,"-")}`;
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        const qrCode = await QRCode.toDataURL(upiLink);
        const payment = await Payment.create({
        name,
        amount,
        email,
        upiLink,
        qrCode,
        expiresAt,
        });

        if (payment) {
            const payUrl = `https://quickpayqrbackend.onrender.com/api/payments/pay/${payment._id}`;
            try {
                await sendMail(
                email,
                "Payment Request - QuickPayQR",
                `
                <h2>Hello ${name}👋</h2>

                <p>You need to pay <b>₹${amount}</b>.</p>

                <p>Scan this QR to pay:</p>

                <img src="${qrCode}" width="200"/>

                <br/><br/>

                <p>Or click the button below</p>

                <a href="${payUrl}"
                style="padding:10px 20px;background:green;color:white;text-decoration:none;border-radius:5px;">
                Pay ₹${amount}
                </a>

                <p>Thank you 🙏</p>
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

    if(payment.expiresAt < new Date()){
        return res.send("<h2>Payment Link expired...</h2>")
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