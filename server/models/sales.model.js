const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesSchema = new Schema({
    amount: { type: String, required: true },
    // customer_name: { type: String, required: true }, // not required i.e Redundant
    customer_id: { type: String, required: true },
    discount: { type: String, required: true },
    foc: { type: String, required: true },
    invoice_number: { type: Number, required: true },
    invoice_date: { type: Date, required: true },
    net_amount: { type: String, required: true },
    sku_id: { type: String, required: true },
    product: { type: mongoose.Schema.Types.ObjectId , ref:'product', required: true },  // added ref to product
    price: { type: String, required: true },
    quantity: { type: String, required: true },
    region: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
});

module.exports = Sales = mongoose.model('sales', SalesSchema);
