const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const areaSchema = new Schema({
    name: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref:"city", required: true },
    hub: { type: Schema.Types.ObjectId, ref:"user", required: true },
    is_active:{type:Boolean, required:true}
},
{versionKey:false});

module.exports = mongoose.model('area', areaSchema);
