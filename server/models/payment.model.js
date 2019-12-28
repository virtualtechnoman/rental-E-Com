const mongoose = require("mongoose");
module.exports = mongoose.model("payment", new mongoose.Schema({
    customer: { type: mongoose.Schema.Types.ObjectId,ref:"user", required: true },
    mode: { type: String },
    amount: { type: Number, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default:Date.now },
    createdBy:{ type: mongoose.Schema.Types.ObjectId,ref:"user", required: true }
}, {
        versionKey: false
    }))