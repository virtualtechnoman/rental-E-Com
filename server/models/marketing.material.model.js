const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const marketingMaterialSchema = new Schema({
    name: { type: String, required: true }
},
{versionKey:false});

module.exports = mongoose.model('marketing_material', marketingMaterialSchema);
