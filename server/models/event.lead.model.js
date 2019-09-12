const mongoose = require("mongoose");
const cmnt = mongoose.Schema({
    created_by:{ type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    at: { type: Date, default:Date.now },
    comment:String,
    nextDate: { type: Date, required: true },
},{
    versionKey:false,
    _id:false
});

module.exports = mongoose.model("event_lead", new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String},
    contact: { type: String, required: true },
    gender: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'city', required: true },
    address: { type: String, required: true },
    comments: [cmnt],
    mode: { type: String},
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'event', required: true },
    preferredTime: { type: Date, required: true },
    callStatus: { type: String, default:"Pending" },
    status: { type: String, default:"Pending" },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }
}, {
        versionKey: false
    }))