const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// const avlbl = mongoose.Schema({
//     hub
// })
// Create Schema
const ProductSchema = new Schema({
    name: { type: String, required: true },
    product_id: { type: String, required: true , unique:true},
    category: { type: mongoose.Schema.Types.ObjectId, ref:"product_category", required: true },
    is_active: { type: Boolean, default:true, required: true },
    farm_price: { type: Number, required: false },
    selling_price: { type: Number, required: true },
    brand: { type: mongoose.Schema.Types.ObjectId,ref:'brand', required: true },
    details: { type: String, default:""},
    created_by: { type: mongoose.Schema.Types.ObjectId,ref:'user', required: true },
    available_for: [{ type: mongoose.Schema.Types.ObjectId, ref:"user"}],
    created_date: { type: Date, default: Date.now }
    // image: { type: String, required: false },
    // category: { type: mongoose.Schema.Types.ObjectId, ref:'category', required: true },
    // brand: { type: mongoose.Schema.Types.ObjectId, ref:'brand', required: true },
    // created_by: { type: String, required: true },
    // available_for: { type: mongoose.Schema.Types.ObjectId,ref:'user', required: true }
},{
    versionKey:false
});

module.exports = Product = mongoose.model('product', ProductSchema);
