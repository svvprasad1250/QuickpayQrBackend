import mongoose from "mongoose";

const paymentSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    upiLink:{
        type:String
    },
    status:{
        type:String,
        enum:["paid","pending","failed"],
        default:"pending"
    },
    qrCode:{
        type:String
    },
    expiresAt:{
        type: Date,
        required: true
    }
},
{timestamps:true}
)

const Payment = mongoose.model("Payment",paymentSchema);
export default Payment;