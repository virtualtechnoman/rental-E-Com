const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref:"product", required: true },
    quantity:{type:Number},
    startDate:{type:Number},
    frequencyDates:[Date],
    user:{type:Schema.Types.ObjectId, ref:"user"}
},
{versionKey:false});

module.exports = mongoose.model('area', areaSchema);
