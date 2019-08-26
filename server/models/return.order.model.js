const mongoose = require("mongoose");
const prods = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    requested: { type: Number, required: true },
    billed:{type:Number, default:0},
    recieved:{type:Number, default:0}
},{
    _id:false,
    versionKey: false
})
module.exports = mongoose.model("returnorder", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [prods],
    challan_accepted: { type: Boolean, default: false },
    recieved: { type: Boolean, default: false },
    billed: { type: Boolean, default: false },
    status:{ type: String, required: true },
    challan_generated: { type: Boolean, default: false },
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))