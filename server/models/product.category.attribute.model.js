const mongoose = require("mongoose");

module.exports = mongoose.model("product_attribute", new mongoose.Schema({
    name: { type: String, lowercase: true, trim: true },
    is_active: { type: Boolean, default: false },
    options: [{ type: Object, lowercase: true, trim: true }]
}, {
    versionKey: false
}))