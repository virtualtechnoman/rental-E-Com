const mongoose = require("mongoose");


module.exports = mongoose.model("challan", new mongoose.Schema({
    challan_id: { type: String, required: true },
    processing_unit_incharge: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, //Logged in user
    dispatch_processing_unit: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId, ref: "product", required: true
        },
        requested: {
            type: Number, required: true
        },
        accepted: {
            type: Number, required: true
        },
        // dispatch: {
        //     type: Boolean, required: true
        // }
    }],
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref:"vehicle", required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref:"driver", required: true },
    notes: {
        type: String
    },
    // status:{type:String, required:true},
    challan_date: {
        type: Date, default: Date.now
    },
    staus: { type: Boolean, required: true }
}, {
        versionKey: false
    }))
