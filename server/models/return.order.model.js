const mongoose = require("mongoose");
const prods = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    requested: { type: Number, required: true },
    billed: { type: Number, default: 0 },
    recieved: { type: Number, default: 0 }
}, {
        _id: false,
        versionKey: false
    })
module.exports = mongoose.model("returnorder", new mongoose.Schema({
    rorder_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [prods],
    notes: { type: String },
    challan_accepted: { type: Boolean, default: false },
    recieved: { type: Boolean, default: false },
    billed: { type: Boolean, default: false },
    status: { type: String, required: true },
    challan_generated: { type: Boolean, default: false },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
    rorder_date: { type: Date, default: Date.now },
    remarks: {
        generateChallan: {
            generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            image: { type: String },
            at: { type: Date },
            note: { type: String }
        },
        acceptChallan: {
            at: { type: Date }
        },
        recieveROrder: {
            recievedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            image: { type: String },
            at: { type: Date },
            note: { type: String }
        },
        billROrder: {
            billedBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
            image: { type: String },
            at: { type: Date },
            note: { type: String }
        }
    }
}, {
        versionKey: false
    }))