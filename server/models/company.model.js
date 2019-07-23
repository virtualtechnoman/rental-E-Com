const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CompanySchema = new Schema({
    company_id: { type: String, required: true },
    company_name: {
        type: String,
        required: true
    },
    company_id: {
        type: String,
        required: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = Company = mongoose.model('company', CompanySchema);
