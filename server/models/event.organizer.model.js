const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventOrganizerSchema = new Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true }
},
{versionKey:false});

module.exports = mongoose.model('event_organizer', eventOrganizerSchema);
