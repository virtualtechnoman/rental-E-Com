const mongoose = require("mongoose");
module.exports = mongoose.model("customer_order", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        quantity: { type: Number, required: true },
        versionKey: false
    }],
    // notes: { type: String, required: false },
    // status: { type: Boolean, default: false },
    status:{type:String},
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))