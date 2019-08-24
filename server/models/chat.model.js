const mongoose = require("mongoose");
const msg = mongoose.Schema({
    customer:String,
    executive:String,
    at:{type:Date,default:Date.now}
},{
    versionKey:false,
    _id:false
})
module.exports = mongoose.model("live_chat",mongoose.Schema({
    created_by:{type:mongoose.Schema.Types.ObjectId, ref:"user", required:true},
    responded_by:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    messages:[msg],
    is_open:{type:Boolean, default:true},
    created_at:{type:Date, default:Date.now}
},{
    versionKey:false
}))