const mongoose = require("mongoose");


module.exports = mongoose.model("product_category_attribute", new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref:"product_category"},
    values: [String],
    is_active: { type: Boolean, default:true, required: true }
}, {
        versionKey: false
    }))