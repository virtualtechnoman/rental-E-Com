const mongoose = require("mongoose");

const MarketingMaterial = mongoose.Schema({
    material:{ type: mongoose.Schema.Types.ObjectId, ref: 'marketing_material', required: true },
    quantity:{type:Number, required:true}
},{
    versionKey:false,
    _id:false   
});

const Product = mongoose.Schema({
    product:{ type: mongoose.Schema.Types.ObjectId, ref: 'product'},
    quantity:{type:Number}
},{
    versionKey:false,
    _id:false   
});
module.exports = mongoose.model("event", new mongoose.Schema({
    event_id: { type: String, required: true },
    type: { type: mongoose.Schema.Types.ObjectId, ref: "event_type" },
    name: { type: String, required: true },
    city: { type: String },
    address: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'event_organizer', required: true },
    incharge: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }],
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    marketingMaterial: [MarketingMaterial],
    cost: { type: Number, required: true },
    time: { type: Date, default: false },
    targetLeads: { type: Number, required: true },
    targetConversion: { type: Number, required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    products:[Product],
    hub: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    created_at: { type: Date, default: Date.now },
    cancelled:{type:Boolean, default:false},
    status: { type: String, default: "Pending" }
}, {
        versionKey: false
    }))