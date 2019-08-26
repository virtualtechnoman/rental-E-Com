const Joi = require('joi');
const helper = require('../utils/helper');
const brandCreateShcema = Joi.object().keys({
    name: Joi.string().required(),
    contact: Joi.string().required(),
    address: Joi.string().required(),
    logo: Joi.string().optional()
})
const brandUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    contact: Joi.string().optional(),
    address: Joi.string().optional(),
    logo: Joi.string().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}


function verifyCreate(brand) { return helper.validator(brand, brandCreateShcema) }
function verifyUpdate(brand) { return helper.validator(brand, brandUpdateSchema) }
