const helper = require('../utils/helper');
const Joi = require('joi');


const userSchema = Joi.object({
  full_name: Joi.string().required(), 
  password: Joi.string().required(), 
  email: Joi.string().email().required(),
  role: Joi.string().required(), 
  mobile_number: Joi.string().required(), 
  profile_picture: Joi.string().optional(),
  is_active: Joi.boolean().required(),
  H_no_society:Joi.string().optional(),
  dob:Joi.date().required(),
  gender:Joi.string().required(),
  landmark: Joi.string().required(), 
  street_address: Joi.string().required(), 
  city: Joi.string().required(),
  // repeatPassword: Joi.string().required().valid(Joi.ref('password')),
})
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
const userRegisterSchema = Joi.object({
  full_name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  // role:Joi.string().required()
})
const customerAddSchema = Joi.object({
  full_name:Joi.string().required(),
  mobile_number: Joi.string().required(),
  landmark: Joi.string().required(),
  street_address: Joi.string().required(),
  city : Joi.string().required(),
  dob : Joi.date().required(),
  H_no_society:Joi.string().optional()
})
const userMobileRegisterSchema = Joi.object({
  // full_name: Joi.string().required(),
  // password: Joi.string().required(),
  mobile_number: Joi.string().required(),
  // role:Joi.string().required()
})
const userMobileLoginSchema = Joi.object({
  // full_name: Joi.string().required(),
  // password: Joi.string().required(),
  mobile_number: Joi.string().required(),
  // role:Joi.string().required()
})
const userMobileOtpSchema = Joi.object({
  // full_name: Joi.string().required(),
  // password: Joi.string().required(),
  mobile_number: Joi.string().required(),
  otp: Joi.string().required()
  // role:Joi.string().required()
})

const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required()
})
const driverAddSchema = Joi.object({
  full_name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  mobile_number: Joi.string().required(),
  dl_number:Joi.string().required(),
  is_active: Joi.boolean().required(),
  gender:Joi.string().required(),
  dob:Joi.date().required(),
  profile_picture: Joi.string().optional(),
  latitude: Joi.string().optional(),
  longitutde: Joi.string().optional(),
  landmark: Joi.string().optional(),
  street_address: Joi.string().optional(),
  city: Joi.string().optional()
})
module.exports = {
  verifyCreate: verifyCreate,
  verifyUpdate: verifyUpdate,
  verifyRegister: verifyRegister,
  verifyLogin: verifyLogin,
  verifyMobileRegister: verifyMobileRegister,
  verifyMobileLogin: verifyMobileLogin,
  verifyMobileOtp: verifyMobileOtp,
  verifyAddDriver,
  verifyDBoyProfileUpdateOwn
}

const dBoyProfileUpdateOwnSchema = Joi.object({
  full_name: Joi.string().required(),
  H_no_society:Joi.string().optional(),
  landmark: Joi.string().optional(), 
  dob:Joi.date().optional(),
  dl_number: Joi.string().optional(), 
  emergency_contact: Joi.string().optional(), 
  street_address: Joi.string().optional(),
  permanent_address: Joi.string().optional(),
  vehicle_type: Joi.string().optional(),
  'kyc.documentType':Joi.string().optional()
  })

function verifyCreate(user) { return helper.validator(user, userSchema) }
function verifyUpdate(user) { return helper.validator(user, userUpdateSchema) }
function verifyRegister(user) { return helper.validator(user, userRegisterSchema) }
function verifyMobileRegister(user) { return helper.validator(user, userMobileRegisterSchema) }
function verifyMobileLogin(user) { return helper.validator(user, userMobileLoginSchema) }
function verifyLogin(user) { return helper.validator(user, userLoginSchema) }
function verifyMobileOtp(user) { return helper.validator(user, userMobileOtpSchema) }
function verifyAddDriver(user) { return helper.validator(user, driverAddSchema) }
// function verifyAddCustomer(user) { return helper.validator(user, driverAddSchema) }
function verifyDBoyProfileUpdateOwn(user) { return helper.validator(user, dBoyProfileUpdateOwnSchema) }

