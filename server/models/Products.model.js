const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
    brand: { type: String, required: true },
    cif_price: { type: String, required: true },
    business_unit: { type: String, required: true },
    // business_unit_id: { type: String, required: true },
    date: { type: Date, default: Date.now },
    distirbutor: { type: String, required: true },
    form: { type: String, required: true },
    is_active: { type: Boolean, required: true },
    notes: { type: String, required: false },
    pack_size: { type: String, required: true },
    promoted: { type: Boolean, required: true },
    range: { type: String, required: true },
    registered: { type: Boolean, required: true },
    strength: { type: String, required: true },
    sku_id: { type: String, required: true },
    sku_name: { type: String, required: true },
    therapy_line: { type: String, required: true },
    whole_price: { type: String, required: true },
});

module.exports = Product = mongoose.model('product', ProductSchema);
