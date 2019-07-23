const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IncentivePeriodSchema = new Schema({
    therapyline_id: { type: String, required: true },
    period_type: { type: String, required: true },
    periods: { type: Array, required: true }
});

module.exports = incentiveperiod = mongoose.model('incentiveperiod', IncentivePeriodSchema);
