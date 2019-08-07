const mongoose = require("mongoose");

const Products = 

module.exports = mongoose.model("challan", new mongoose.Schema({
    challan_id: { type: String, required: true },
    processing_unit_incharge: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true }, //Logged in user
    dispatch_processing_unit: { type: String, required: true },
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
        dispatch: {
            type: Boolean, required: true
        }
    }],
        vehicle_no:{type:String,required:true},
        vehicle_type:{type:String,required:true},
        driver_name:{type:String,required:true},
        driver_mobile:{type:String,required:true},
        dl_no:{type:String,required:true},
        departure:{type:Date,required:true},
    notes: {
        type: String
    },
    // status:{type:String, required:true},
    challan_date: {
        type: Date, default: Date.now
    }
}, {
        versionKey: false
    }))
