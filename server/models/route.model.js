const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const routeSchema = new Schema({
    name: { type: String, required: true },
    delivery_boy:{type:Schema.Types.ObjectId, ref:"user"},
    is_active:{type:Boolean, required:true}
},
{versionKey:false});

module.exports = mongoose.model('route', routeSchema);
