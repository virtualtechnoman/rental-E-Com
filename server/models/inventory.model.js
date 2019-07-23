const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InventorySchema = new Schema({
    batch_no: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    expiry_date: { type: Date, required: true },
    is_active: { type: Boolean, required: true },
    notes: { type: String, required: false },
    quantity: { type: String, required: true },
    region: { type: String, required: true },
    sku_id: { type: String, required: true },
    sku: { type: String, required: false },
});

module.exports = Inventory = mongoose.model('inventory', InventorySchema);