import express from "express";
import { createPayment, payRedirect } from "../controllers/paymentController.js";
const router = express.Router();
router.post("/payment",createPayment);
router.get("/pay/:id",payRedirect);

export default router;