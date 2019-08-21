const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    name: { type: String, required: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: 'state', required: true },
    is_active:{type:Boolean, required:true}
},
{
    versionKey:false
});

module.exports = City = mongoose.model('city', CitySchema);
