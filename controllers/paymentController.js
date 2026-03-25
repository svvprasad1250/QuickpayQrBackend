import Payment from "../models/paymentModel.js";
import sendMail from "../utils/sendMail.js";
import QRCode from "qrcode";

export const createPayment = async (req, res) => {
    try {
        const { name, amount, email } = req.body;

        const upiLink = `upi://pay?pa=venkatprashu008@ybl&pn=Prasad&am=${amount}&cu=INR&tn=${name.replace(/\s/g, "-")}`;

        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

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
            <h2>Hello ${name} 👋</h2>

            <p>You need to pay <b>₹${amount}</b>.</p>

            <p>Scan this QR to pay:</p>

            <img src="cid:paymentqr" width="200"/>

            <br/><br/>

            <p>Or click the button below</p>

            <a href="${payUrl}"
            style="padding:12px 22px;background:green;color:white;text-decoration:none;border-radius:5px;">
            Pay ₹${amount}
            </a>

            <p>This payment link expires in 24 hours.</p>

            <p>Thank you 🙏</p>
            `,
            qrCode
            );
        } catch (err) {
            console.log("Email failed:", err.message);
        }

        res.status(201).json(payment);
        }
    } catch (error) {
        console.error(error);
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

    <p><b>Scan this QR using any UPI app</b></p>

    <img id="qrImage" src="${payment.qrCode}" width="250"/>

    <br/><br/>

    <button onclick="downloadQR()"
    style="padding:12px 20px;background:blue;color:white;
    border:none;border-radius:6px;font-size:16px;cursor:pointer;">
    Download QR
    </button>

    <script>
    function downloadQR() {
        const link = document.createElement('a');
        link.href = document.getElementById('qrImage').src;
        link.download = 'payment-qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    </script>

    </body>
    </html>
    `);
};