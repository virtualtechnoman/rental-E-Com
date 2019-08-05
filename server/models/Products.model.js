const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProductSchema = new Schema({
    name: { type: String, required: true },
    product_id: { type: String, required: true , unique:true},
    image: { type: String, required: false },
    created_date: { type: Date, default: Date.now },
    category: { type: String, required: true },
    // category: { type: mongoose.Schema.Types.ObjectId, ref:'category', required: true },
    is_active: { type: Boolean, default:true, required: true },
    farm_price: { type: Number, required: false },
    selling_price: { type: Number, required: true },
    product_dms: { type: String, required: true },
    brand: { type: String, required: true },
    // brand: { type: mongoose.Schema.Types.ObjectId, ref:'brand', required: true },
    details: { type: String, required: true },
    // created_by: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId,ref:'user', required: true },
    available_for: { type: String, required: true }
    // available_for: { type: mongoose.Schema.Types.ObjectId,ref:'user', required: true }
});

module.exports = Product = mongoose.model('product', ProductSchema);
