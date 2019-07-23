const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    city_name: { type: String, required: true },
    city_id: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    is_active: { type: Boolean, required: true },
    region: { type: mongoose.Schema.Types.ObjectId, ref: 'region', required: true },
});

module.exports = City = mongoose.model('city', CitySchema);
