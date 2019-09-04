const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventTypeSchema = new Schema({
    name: { type: String, required: true }
},
{versionKey:false});

module.exports = mongoose.model('event_type', eventTypeSchema);
