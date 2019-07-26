const helper = require('../utils/helper');
const Joi = require('joi');


const userSchema = Joi.object({
  email: Joi.string().required(),
  full_name: Joi.string().required(),
  is_active: Joi.boolean().required(),
  mobile_phone: Joi.string().required(),
  // mobile_phone: Joi.string(),
  // .regex(/^[1-9][0-9]{9}$/),
  role: Joi.string().required(),
  password: Joi.string().required(),
  // repeatPassword: Joi.string().required().valid(Joi.ref('password')),
})

module.exports = {
  insert
}

function insert(user) { return helper.validator(user, userSchema) }

