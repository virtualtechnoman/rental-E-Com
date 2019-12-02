const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
    user: { type: String, required: true },
    dates: [Date]
},
    { versionKey: false });

module.exports = mongoose.model('attendance', attendanceSchema);
