const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Create Schema
const CustomerAssignmentSchema = new Schema({
    customer: { type: mongoose.Schema.Types.ObjectId, ref:"customer", required: true }, // added 'ref' keyword
    shares: { type: Array, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref:"user", required: true }, // added 'ref' keyword
    created_date: { type: Date, default: Date.now },
});

module.exports = customerAssignment = mongoose.model('customerAssignment', CustomerAssignmentSchema);
