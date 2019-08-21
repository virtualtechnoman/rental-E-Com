const mongoose = require("mongoose");

module.exports = mongoose.model("returnorder", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
        requested: { type: Number, required: true }
    }],
    status: { type: Boolean, default: false },
    challan_generated: { type: Boolean, default: false },
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))