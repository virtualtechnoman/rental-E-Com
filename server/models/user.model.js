const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true, },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  password: {
    type: String, // required: true
  },
  joining_date: { type: Date, default: Date.now },
  job_title: { type: String, required: true },
  is_active: { type: Boolean, required: true, default: true },
  therapy_line: { type: mongoose.Schema.Types.ObjectId, ref: 'therapy', required: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: false },
  position: { type: String, required: true },
  title: { type: String, required: false },
  mobile_phone: { type: String, required: true },
  home_phone: { type: String, required: false },
  business_phone: { type: String, required: false },
  business_extension: { type: String, required: false },
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'region', required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'city', required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: 'country', required: true },
  address: { type: String, required: false },
  postal_code: { type: String, required: false },
  notes: {
    type: String, // required: true
  },
  photo: {
    type: String, default: "null"
    // required: true
  },
  attachments: {
    type: String, default: "null"
    // required: true
  },
}, {
    versionKey: false
  });


module.exports = mongoose.model('User', UserSchema);