const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//WHOLE SCHEMA IS NOT REQUIRED

const DistirbutorSchema = new Schema({
    distirbutor_id: { type: String, required: true },
    distirbutor_name: { type: String, required: true },
    is_active: { type: Boolean, required: true },
    created_date: { type: Date, default: Date.now },
});

module.exports = Distirbutor = mongoose.model('distibutor', DistirbutorSchema);
