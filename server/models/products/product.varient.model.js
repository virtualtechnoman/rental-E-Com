const mongoose = require('mongoose');
const mongodb = require('mongodb');
const Schema = mongoose.Schema;

const productType = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
    attributes: [{
        name: { type: String, lowercase: true, trim: true },
        value: { type: mongoose.Schema.Types.ObjectId, ref: 'product_option' }
    }],
    is_active: { type: Boolean, required: true, default: false }
}, { versionKey: false });

module.exports = mongoose.model('product_varient', productType);