const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
    message: { type: String },
    users: [{type:mongoose.Schema.Types.ObjectId, ref:"user"}],
    createdBy: {type:mongoose.Schema.Types.ObjectId, ref:"user"},
    createdAt:{type:Date, default:Date.now}
}, {
        versionKey: false,
        _id:false
    })
module.exports = mongoose.model("notification", NotificationSchema)