const mongoose = require('mongoose');

module.exports = mongoose.model('state', new mongoose.Schema({
    name: { type: String, required: true },
    is_active:{type:Boolean, required:true}
},
    {
        versionKey: false
    }));
