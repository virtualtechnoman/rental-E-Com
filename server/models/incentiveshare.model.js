const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncentiveShareSchema = new Schema({
    therapyline_id: { type:String, required:true},
    floor: { type: Number, required: true },
    celing: { type: Number, required: true },
    shares: { type: Array, required: true },
});

module.exports = incentiveshare = mongoose.model('incentiveshare', IncentiveShareSchema);
