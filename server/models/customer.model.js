const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({
    city_name: { type: String, required: true },
    customer_id: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_type: { type: String, required: true },
    distirbutor_1_name: { type: String, required: true },
    distirbutor_2_name: { type: String, required: false },
    distirbutor_3_name: { type: String, required: false },
    share_1: { type: Number, required: true },
    share_2: { type: Number, required: false },
    share_3: { type: Number, required: false },
    district_name: { type: String, required: true },
    region_name: { type: String, required: true },
    sector: { type: String, required: true },
    customer_type: { type: String, required: true },
    notes: { type: String },
    is_active: { type: Boolean, required: true },
    created_date: { type: Date, default: Date.now },
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);
