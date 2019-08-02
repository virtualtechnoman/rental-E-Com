const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const User_Role_Schema = new Schema({
  name: { type: String, required: true, unique:true }
});

module.exports = mongoose.model('user_role', User_Role_Schema);


