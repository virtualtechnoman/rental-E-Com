const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DistrictSchema = new Schema({
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'city', required: true },
    district_id: { type: String, required: true },
    district_name: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    is_active: { type: Boolean, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = District = mongoose.model('district', DistrictSchema);
