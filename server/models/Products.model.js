const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attr = mongoose.Schema({
    name: String,
    value: String
},
    {
        _id: false,
        versionKey: false
    })
// const avlbl = mongoose.Schema({
//     hub
// })
// Create Schema
const ProductSchema = new Schema({
    attributes: [attr],
    available_for: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'brand', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "product_category", required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    created_date: { type: Date, default: Date.now },
    details: { type: String, default: "" },
    farm_price: { type: Number, required: false },
    is_active: { type: Boolean, default: true, required: true },
    is_available: { type: Boolean, default: false, required: false },
    image: { type: String },
    name: { type: String, required: true },
    product_id: { type: String, required: true, unique: true },
    selling_price: { type: Number, required: true },
    stock: { type: Number, default: 0, required: true },
}, {
    versionKey: false
});

module.exports = Product = mongoose.model('product', ProductSchema);
