const mongoose = require("mongoose");
module.exports = mongoose.model("order_status", new mongoose.Schema({
    name: String,
    value: Number
}, {
        versionKey: false
    }))