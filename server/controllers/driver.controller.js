const Joi = require('joi');
const helper = require('../utils/helper');
const driverCreateShcema = Joi.object().keys({
    name: Joi.string().required(),
    mobile: Joi.string().required(),
    dl_number: Joi.string().required(),
    isAvailable:Joi.boolean().required()
})
const driverUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    mobile: Joi.string().optional(),
    dl_number: Joi.string().optional(),
    isAvailable:Joi.boolean().optional()
})

module.exports = {
    verifyCreate: verifyCreate,
    verifyUpdate: verifyUpdate
}


function verifyCreate(driver) { return helper.validator(driver, driverCreateShcema) }
function verifyUpdate(driver) { return helper.validator(driver, driverUpdateSchema) }
