const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TherapySchema = new Schema({
    bu: { type: mongoose.Types.ObjectId, ref: 'bu', required: true },
    // bu_id: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    notes: { type: String },
    therapyline: { type: String, required: true },
    therapyline_id: { type: String, required: true },
});

module.exports = Therapy = mongoose.model('therapy', TherapySchema);
