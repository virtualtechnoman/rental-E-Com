const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  password: {
    type: String, // required: true
  },
  is_active: { type: Boolean, required: true, default: true },
  // role: { type: mongoose.Schema.Types.ObjectId, ref: 'user_role', required: true },
  role: { type: String, required: true },
  mobile_phone: { type: String, required: true },
}, {
    versionKey: false
  });


module.exports = mongoose.model('User', UserSchema);