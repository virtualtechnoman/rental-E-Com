const mongoose = require("mongoose");
const prods = mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
    requested: { type: Number, required: true },
    accepted: { type: Number, default: 0 },
    dispatched:{type:Number, default:0},
    billed:{type:Number, default:0},
    recieved:{type:Number, default:0},
    // note:String,
    // date:Date,
},{
    _id:false,
    versionKey: false
})
module.exports = mongoose.model("order", new mongoose.Schema({
    order_id: { type: String, required: true },
    placed_by: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    placed_to: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    products: [prods],
    notes: { type: String},
    // remarks:{
    //     acceptOrder:{
    //         acceptedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
    //         image:{type:String},
    //         at:{type:Date},
    //         note:{type:String}
    //     },
    //     generateChallan:{
    //         generatedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
    //         image:{type:String},
    //         at:{type:Date},
    //         note:{type:String}
    //     },
    //     acceptChallan:{
    //         acceptedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
    //         image:{type:String},
    //         at:{type:Date},
    //         note:{type:String}
    //     },
    //     recieveOrder:{
    //         recievedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
    //         image:{type:String},
    //         at:{type:Date},
    //         note:{type:String}
    //     },
    //     billOrder:{
    //         billedBy:{ type: mongoose.Schema.Types.ObjectId, ref: "user"},
    //         image:{type:String},
    //         at:{type:Date},
    //         note:{type:String}
    //     }
    // },
    accepted: { type: Boolean, default: false },
    challan_accepted: { type: Boolean, default: false },
    recieved: { type: Boolean, default: false },
    billed: { type: Boolean, default: false },
    challan_generated: { type: Boolean, default: false },
    status:{ type: String, required: true },
    order_date: { type: Date, default: Date.now }
}, {
        versionKey: false
    }))