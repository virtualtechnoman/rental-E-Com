const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TargetSchema = new Schema({
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    customer_id: { type: String, required: true },
    customer_type: { type: String, required: true },
    customer_name: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    // is_active: { type: Boolean, default: true },
    jan: { type: String },
    feb: { type: String },
    mar: { type: String },
    apr: { type: String },
    may: { type: String },
    jun: { type: String },
    jul: { type: String },
    aug: { type: String },
    sep: { type: String },
    oct: { type: String },
    nov: { type: String },
    dec: { type: String },
});

module.exports = Target = mongoose.model('target', TargetSchema);
