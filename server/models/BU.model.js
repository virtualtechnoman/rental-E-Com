const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BUSchema = new Schema({
    bu: { type: String, required: true },
    bu_name: { type: String, required: true },
    is_active: { type: Boolean, required: true },
    created_date: { type: Date, default: Date.now },
});

module.exports = BU = mongoose.model('bu', BUSchema);
