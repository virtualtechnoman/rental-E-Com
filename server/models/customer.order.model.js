const mongoose = require("mongoose");

const Product = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    quantity: { type: Number, required: true }
},
    {
        _id:false,
        versionKey: false
    })
module.exports = mongoose.model("customer_order", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    products: [Product],
    amount:Number,
    isDelivered:{type:Boolean, default:false},
    isCancelled:{type:Boolean, default:false},
    status: { type: String },
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))