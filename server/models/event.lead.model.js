const mongoose = require("mongoose");

module.exports = mongoose.model("event_lead", new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String},
    contact: { type: String, required: true },
    gender: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'city', required: true },
    address: { type: String, required: true },
    comments: { type: String},
    mode: { type: String},
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'event', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
}, {
        versionKey: false
    }))