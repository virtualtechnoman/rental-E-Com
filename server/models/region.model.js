const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Country = './country.model.js'
// const RegionSchema = new Schema({
//     country_id: { type: String, required: true },
//     country_name: { type: String, required: true },
//     region_id: { type: String, required: true, },
//     region_name: { type: String, required: true, },
//     is_active: { type: Boolean, required: true },
//     created_date: { type: Date, default: Date.now }
// });

const RegionSchema = new Schema({
    country: { type: mongoose.Schema.Types.ObjectId, ref:'country', required: true },
    region_id: { type: String, required: true, },
    region_name: { type: String, required: true, },
    is_active: { type: Boolean, required: true },
    created_date: { type: Date, default: Date.now }
});
module.exports = Region = mongoose.model('region', RegionSchema);
