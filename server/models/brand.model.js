const mongoose = require("mongoose");
module.exports = mongoose.model("brand", new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: String, required: true },
    address: { type: String, required: true },
    logo: { type: String }
}, {
        versionKey: false
    }))