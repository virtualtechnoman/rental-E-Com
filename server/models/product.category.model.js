const mongoose = require("mongoose");


module.exports = mongoose.model("product_category", new mongoose.Schema({
    name: { type: String, required: true },
    is_active: { type: Boolean, default:true, required: true }
}, {
        versionKey: false
    }))