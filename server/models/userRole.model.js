const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const User_Role_Schema = new Schema({
  name: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, required: true },
  privileges: {type:Object, required:true}
  // {
  //   //User Operations
  //   GET_ALL_USERS: false,
  //   GET_USER_BY_ROLE: false,
  //   ADD_NEW_USER: false,
  //   DELETE_USER: false,
  //   UPDATE_USER: false,
  //   //Product Privilege
  //   GET_ALL_PRODUCTS:false,
  //   GET_ALL_PRODUCTS_OWN:false,
  //   GET_PRODUCT:false,
  //   ADD_NEW_PRODUCT:false,
  //   DELETE_PRODUCT:false,
  //   UPDATE_PRODUCT:false,
  //   //Order Operations Privilege
  //   GET_ALL_ORDERS:false,
  //   GET_ALL_ORDERS_OWN:false,
  //   GET_ORDER:false,
  //   ADD_NEW_ORDER:false,
  //   DELETE_ORDER:false,
  //   //Return Order Privilege
  //   GET_ALL_RETURN_ORDERS:false,
  //   GET_ALL_RETURN_ORDERS_OWN:false,
  //   GET_RETURN_ORDER:false,
  //   ADD_NEW_RETURN_ORDER:false,
  //   DELETE_RETURN_ORDER:false,
  //   //Challan Privilege
  //   GET_ALL_CHALLAN:false,
  //   GET_ALL_CHALLAN_OWN:false,
  //   GET_CHALLAN:false,
  //   ADD_NEW_CHALLAN:false,
  //   DELETE_CHALLAN:false,
  //   //Vehicle Privilege
  //   GET_ALL_VEHICLES:false,
  //   DELETE_VEHICLE:false,
  //   UPDATE_VEHICLE:false,
  //   ADD_NEW_VEHICLE:false,
  //   //Driver Privilege
  //   GET_ALL_DRIVERS:false,
  //   DELETE_DRIVER:false,
  //   UPDATE_DRIVER:false,
  //   ADD_NEW_DRIVER:false
  // }
}, {
    versionKey: false
  });

module.exports = mongoose.model('user_role', User_Role_Schema);


