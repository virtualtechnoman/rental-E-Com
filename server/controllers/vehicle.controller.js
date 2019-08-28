const Joi = require('joi');
const helper = require('../utils/helper');
const vehicleCreateShcema = Joi.object().keys({
    number: Joi.string().required(),
    type: Joi.string().required(),
    image: Joi.string().optional(),
    note: Joi.string().optional(),
    isAvailable:Joi.boolean().required()
})
const vehicleUpdateSchema = Joi.object({
    number: Joi.string().optional(),
    type: Joi.string().optional(),
    image: Joi.string().optional(),
    note: Joi.string().optional(),
    isAvailable:Joi.boolean().optional()
})

module.exports = {
    verifyCreate: verifyCreate,
    verifyUpdate: verifyUpdate
}


function verifyCreate(vehicle) { return helper.validator(vehicle, vehicleCreateShcema) }
function verifyUpdate(vehicle) { return helper.validator(vehicle, vehicleUpdateSchema) }
