const helper = require('../utils/helper');
const Joi = require('joi');



const userUpdateSchema = Joi.object({
  full_name: Joi.string().optional(),
  password: Joi.string().optional(),
  email: Joi.string().email().optional(),
  mobile_number: Joi.string().optional(),
  is_active: Joi.boolean().optional(),
  role: Joi.string().optional(),
  dob:Joi.date().optional(),
  gender:Joi.string().optional(),
  profile_picture: Joi.string().optional(),
  latitude: Joi.string().optional(),
  longitutde: Joi.string().optional(),
  landmark: Joi.string().optional(),
  street_address: Joi.string().optional(),
  city: Joi.string().optional()
})
module.exports = {
  // verifyCreate,
  verifyUpdate,
}

// function verifyCreate(user) { return helper.validator(user, dBoyProfileSchema) }
// function verifyUpdate(user) { return helper.validator(user, dBoyProfileSchema) }

