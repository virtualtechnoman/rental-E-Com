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
  // role:Joi.string().required()
})
const userMobileRegisterSchema = Joi.object({
  // full_name: Joi.string().required(),
  // password: Joi.string().required(),
  mobile_number:Joi.string().required(),
  // role:Joi.string().required()
})
const userMobileLoginSchema = Joi.object({
  // full_name: Joi.string().required(),
  // password: Joi.string().required(),
  mobile_number:Joi.string().required(),
  // role:Joi.string().required()
})
const userMobileOtpSchema = Joi.object({
  // full_name: Joi.string().required(),
  // password: Joi.string().required(),
  mobile_number:Joi.string().required(),
  otp:Joi.string().required()
  // role:Joi.string().required()
})

const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email:Joi.string().email().required()
})
module.exports = {
  verifyCreate:verifyCreate,
  verifyUpdate:verifyUpdate,
  verifyRegister:verifyRegister,
  verifyLogin:verifyLogin,
  verifyMobileRegister:verifyMobileRegister,
  verifyMobileLogin:verifyMobileLogin,
  verifyMobileOtp:verifyMobileOtp
}

function verifyCreate(user) { return helper.validator(user, userSchema) }
function verifyUpdate(user) { return helper.validator(user, userUpdateSchema) }
function verifyRegister(user) { return helper.validator(user, userRegisterSchema) }
function verifyMobileRegister(user) { return helper.validator(user, userMobileRegisterSchema) }
function verifyMobileLogin(user) { return helper.validator(user, userMobileLoginSchema) }
function verifyLogin(user) { return helper.validator(user, userLoginSchema) }
function verifyMobileOtp(user) { return helper.validator(user, userMobileOtpSchema) }

