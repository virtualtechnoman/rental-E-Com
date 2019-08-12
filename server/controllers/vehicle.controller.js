const Joi = require('joi');
const helper = require('../utils/helper');
const vehicleCreateShcema = Joi.object().keys({
    number: Joi.string().required(),
    type: Joi.string().required(),
    isAvailable:Joi.boolean().required()
})
const vehicleUpdateSchema = Joi.object({
    number: Joi.string().optional(),
    type: Joi.string().optional(),
    isAvailable:Joi.boolean().optional()
})

module.exports = {
    verifyCreate: verifyCreate,
    verifyUpdate: verifyUpdate
}


function verifyCreate(vehicle) { return helper.validator(vehicle, vehicleCreateShcema) }
function verifyUpdate(vehicle) { return helper.validator(vehicle, vehicleUpdateSchema) }
