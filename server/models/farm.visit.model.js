const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const visitSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:"user"},
    visitors:{type:Number, required:true},
    reason:{type:String, required:true},
    date:{type:Date, required:true},
    isOpen:{type:Boolean, default:true}
},
{versionKey:false});

module.exports = mongoose.model('farm_visit', visitSchema);
