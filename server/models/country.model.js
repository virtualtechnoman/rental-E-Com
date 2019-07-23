const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CountrySchema = new Schema({
    country_id: { type: String, required: true },
    country_name: { type: String, required: true },
    is_active: { type: Boolean, required: true },
    created_date: { type: Date, default: Date.now },
});

module.exports = Country = mongoose.model('country', CountrySchema);
