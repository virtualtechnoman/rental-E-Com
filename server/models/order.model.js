const mongoose = require("mongoose");
const prods = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    requested: { type: Number, required: true },
    accepted: { type: Number, default: 0 },
    dispatched:{type:Number, default:0},
    recieved:{type:Number, default:0}
},{
    versionKey: false
})
module.exports = mongoose.model("order", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [prods],
    notes: { type: String},
    accepted: { type: Boolean, default: false },
    challan_generated: { type: Boolean, default: false },
    status:{type:mongoose.Schema.Types.ObjectId,ref:"order_status", default:process.env.ORDERSTATUS_PENDING || "5d5e3869efbe40d83dc9b2b9" },
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))