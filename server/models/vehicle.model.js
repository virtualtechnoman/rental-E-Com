const mongoose = require("mongoose");
module.exports = mongoose.model("vehicle", new mongoose.Schema({
    number: { type: String, required: true },
    type: { type: String, required: true },
    isAvailable:{type:Boolean,required:true}
},{
    versionKey:false
}))