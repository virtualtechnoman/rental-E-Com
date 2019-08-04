const helper = require('../utils/helper');
const Joi = require('joi');


const userSchema = Joi.object({
  full_name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  mobile_number: Joi.string().required(),
  is_active: Joi.boolean().required()
  // repeatPassword: Joi.string().required().valid(Joi.ref('password')),
})

module.exports = {
  insert
}

function insert(user) { return helper.validator(user, userSchema) }

