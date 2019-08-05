const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true, },
  full_name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true,
    // Regexp to validate emails with more strict rules as added in tests/users.js which also conforms mostly with RFC2822 guide lines
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  is_active:{type:Boolean,required:true,default:true},
  password: {
    type: String, // required: true
  },
  role: { type: mongoose.Schema.Types.ObjectId ,ref:"user_role", required: true }
}, {
    versionKey: false
  });

  UserSchema.methods.getPublicFields = function () {
    var returnObject = {
      id:this._id,
      full_name: this.full_name,
      user_id: this.user_id,
      email: this.email,
      role:this.role,
      is_active:this.is_active
    };
    return returnObject;
};

module.exports = mongoose.model('User', UserSchema);