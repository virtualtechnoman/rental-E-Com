const mongoose = require('mongoose');
const mongodb = require('mongodb');
const Schema = mongoose.Schema;

const productOptions = new Schema({
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'product_attribute' },
    value: { type: String, required: true, lowercase: true, trim: true }
},
    { versionKey: false });

module.exports = mongoose.model('product_option', productOptions);
