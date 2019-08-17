const mongoose = require("mongoose");

const Product = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    quantity: { type: Number }
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