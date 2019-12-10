const mongoose = require('mongoose');
const mongodb = require('mongodb');
const Schema = mongoose.Schema;

const productType = new Schema({
    name: { type: String, required: true, lowercase: true, trim: true },
    attributes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product_attribute' }],
    is_active: { type: Boolean, required: true, default: false }
},
    { versionKey: false });

module.exports = mongoose.model('product_type', productType);
