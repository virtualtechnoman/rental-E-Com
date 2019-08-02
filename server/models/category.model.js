const mongoose = require("mongoose");
module.exports = mongoose.model("category",new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    created_date:{
        type:Date,
        default:Date.now
    }
}))