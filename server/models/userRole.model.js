const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const User_Role_Schema = new Schema({
  user_role: { type: String, required: true },
  can_access_bu: { type: Boolean,required: false },
  can_access_city: { type: Boolean, required:false },
  can_access_country: { type: Boolean, required:false },
  can_access_customer: { type: Boolean, required:false },
  can_access_customer_type: { type: Boolean, required:false },
  can_access_distirbutor: { type: Boolean, required:false },
  can_access_district: { type: Boolean, required:false },
  can_access_g2n: { type: Boolean, required:false },
  can_access_inventory: { type: Boolean, required:false },
  can_access_incentive_period: { type: Boolean, required:false },
  can_access_incentive_share: { type: Boolean, required:false },
  can_access_products: { type: Boolean, required:false },
  can_access_region: { type: Boolean, required:false },
  can_access_reports: { type: Boolean, required:false },
  can_access_sales: { type: Boolean, required:false },
  can_access_target_setting: { type: Boolean, required:false },
  can_access_target_forecasting: { type: Boolean, required:false },
  can_access_therapy: { type: Boolean, required:false },
  can_access_users: { type: Boolean, required:false },
  can_access_user_role: { type: Boolean, required:false },
});

module.exports = User_Role = mongoose.model('user_role', User_Role_Schema);


