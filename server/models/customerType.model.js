const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerTypeSchema = new Schema({
    // customer_id:{ type:String, required :true},   // not required
    type: { type: String, required: true },    // customer_type -> type
    is_active: { type: Boolean, required: true, default:true },
    created_date: { type: Date, default: Date.now },
});

module.exports = CustomerType = mongoose.model('customer_type', CustomerTypeSchema);
