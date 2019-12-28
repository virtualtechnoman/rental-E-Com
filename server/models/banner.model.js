const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    image: { type: String, required: true }
},
{versionKey:false});

module.exports = mongoose.model('banner', areaSchema);
