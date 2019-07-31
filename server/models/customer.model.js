const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CustomerSchema = new Schema({
    city: { type: mongoose.Schema.Types.ObjectId, ref:'city', required: true },    // city_name -> city + now a ref
    customer_id: { type: String, required: true },
    customer_name: { type: String, required: true },
    customer_type: { type: mongoose.Schema.Types.ObjectId, ref:'customer_type', required: true },    // now a ref to customer_type
    distirbutor_1_name: { type: mongoose.Schema.Types.ObjectId, ref:'distributor', required: true },    // now a ref to distributor
    distirbutor_2_name: { type: mongoose.Schema.Types.ObjectId, ref:'distributor', required: false },   // now a ref to distributor
    distirbutor_3_name: { type: mongoose.Schema.Types.ObjectId, ref:'distributor', required: false },   // now a ref to distributor
    share_1: { type: Number, required: true },
    share_2: { type: Number, required: false },
    share_3: { type: Number, required: false },
    district_name: { type: mongoose.Schema.Types.ObjectId, ref:'district', required: true },    // now a ref to district
    // region_name: { type: String, required: true },      // not required here
    sector: { type: String, required: true },
    notes: { type: String },
    is_active: { type: Boolean, required: true },
    created_date: { type: Date, default: Date.now }
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);
