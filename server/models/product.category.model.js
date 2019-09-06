const mongoose = require("mongoose");


module.exports = mongoose.model("product_category", new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String},
    is_active: { type: Boolean, default:true, required: true }
}, {
        versionKey: false
    }))