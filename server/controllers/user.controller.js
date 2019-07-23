const helper = require('../utils/helper');
const Joi = require('joi');


const userSchema = Joi.object({
  address: Joi.string().optional().allow(''),
  attachments: Joi.string().allow('').optional(),
  business_phone: Joi.string().optional().allow(''),
  business_extension: Joi.string().optional().allow(''),
  city: Joi.object().required(),
  country: Joi.object().required(),
  email: Joi.string().required(),
  employee_id: Joi.string().required(),
  first_name: Joi.string().required(),
  home_phone: Joi.string().optional().allow(''),
  is_active: Joi.boolean().required(),
  joining_date: Joi.date().required(),
  job_title: Joi.string().required(),
  manager: Joi.object().required().optional().allow(''),
  last_name: Joi.string().required(),
  mobile_phone: Joi.string().required(),
  Notes: Joi.string().optional().allow(''),
  therapy_line: Joi.object().optional().allow(''),
  mobile_phone: Joi.string(),
  // .regex(/^[1-9][0-9]{9}$/),
  photo: Joi.string().optional().allow(''),
  postal_code: Joi.string().optional().allow(''),
  position: Joi.string().required(),
  region: Joi.object().required(),
  notes: Joi.string().optional().allow(''),
  title: Joi.string().optional().allow(''),
  password: Joi.string().required(),
  // repeatPassword: Joi.string().required().valid(Joi.ref('password')),
})

module.exports = {
  insert
}

function insert(user) { return helper.validator(user, userSchema) }

