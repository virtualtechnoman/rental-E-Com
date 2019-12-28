const mongoose = require("mongoose");
module.exports = mongoose.model("driver", new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    dl_number: { type: String, required: true },
    isAvailable:{type:Boolean, required:true}
}, {
        versionKey: false
    }))