const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesSchema = new Schema({
    customer_name: { type: String, required: true },
    customer_id: { type: String, required: true },
    discount: { type: String, required: true },
    gross_amount: { type: String, required: true },
    foc: { type: String, required: true },
    invoice: { type: Number, required: true },
    invoice_date: { type: Date, required: true },
    net_price: { type: String, required: true },
    product_id: { type: String, required: true },
    product_name: { type: String, required: true },
    price: { type: String, required: true },
    quantity: { type: String, required: true },
    region: { type: String, required: true },
    sector: { type: String, required: true },
    is_active: { type: Boolean, required: true },
    created_date: { type: Date, default: Date.now },
});

module.exports = Sales = mongoose.model('sales', SalesSchema);
