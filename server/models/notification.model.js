const mongoose = require("mongoose");

const Operation = mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    operation: { type: String },
    time:{type:Date.now}

}, {
        versionKey: false,
        _id:false
    })
module.exports = mongoose.model("cart", new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [Product]
}, {
        versionKey: false
    }))