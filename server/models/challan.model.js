const mongoose = require("mongoose");


module.exports = mongoose.model("challan", new mongoose.Schema({
    challan_id: { type: String, required: true },
    processing_unit_incharge: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, //Logged in user
    dispatch_processing_unit: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    order: { type: String },
    order_type: String,
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "vehicle", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    notes: {
        type: String
    },
    // status:{type:String, required:true},
    challan_date: {
        type: Date, default: Date.now
    },
    accepted: { type: Boolean, default: false }
}, {
        versionKey: false
    }))
