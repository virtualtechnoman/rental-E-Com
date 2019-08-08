const mongoose = require("mongoose");
module.exports = mongoose.model("order", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true }, quantity: { type: Number, required: true } }],
    // status:{type:String, required:true},
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))