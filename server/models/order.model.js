const mongoose = require("mongoose");
module.exports = mongoose.model("order", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        quantity: { type: Number, required: true },
        accepted: { type: Number, required: true, default: 0 },
        versionKey: false
    }],
    notes: { type: String, required: false },
    status: { type: Boolean, default: false },
    // status:{type:String, required:true},
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))