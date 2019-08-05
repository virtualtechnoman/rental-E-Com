const helper = require('../utils/helper');
const Joi = require('joi');


const userSchema = Joi.object({
  full_name: Joi.string().required(),
  password: Joi.string().required(),
  email:Joi.string().email().required(),
  role:Joi.string().required(),
  mobile_number:Joi.string().required(),
  is_active:Joi.boolean().required()
  // repeatPassword: Joi.string().required().valid(Joi.ref('password')),
})
const userUpdateSchema = Joi.object({
  full_name: Joi.string().required(),
  password: Joi.string().required(),
  email:Joi.string().email().required(),
  role:Joi.string().required()
})
const userRegisterSchema = Joi.object({
  full_name: Joi.string().required(),
  password: Joi.string().required(),
  email:Joi.string().email().required(),
  role:Joi.string().required()
})

module.exports = {
  verifyCreate:verifyCreate,
  verifyUpdate:verifyUpdate,
  verifyRegister:verifyRegister
}

function verifyCreate(user) { return helper.validator(user, userSchema) }
function verifyUpdate(user) { return helper.validator(user, userUpdateSchema) }
function verifyRegister(user) { return helper.validator(user, userRegisterSchema) }

