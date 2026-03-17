import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoDB from "./config/dbConnection.js";
import paymentRoutes  from "./routes/paymentRoutes.js"
import errorHandler from "./middleware/errorHandler.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 6600;

mongoDB()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/payments",paymentRoutes);
app.use(errorHandler);

app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})