const Joi = require('joi');
const helper = require('../utils/helper');

const cityCreateSchema = Joi.object({
    state: Joi.string().required(),
    name: Joi.string().required(),
    is_active: Joi.boolean().required()
})
const cityUpdateSchema = Joi.object({
    state: Joi.string().optional(),
    name: Joi.string().optional(),
    is_active: Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(city) { return helper.validator(city, cityCreateSchema) }
function verifyUpdate(city) { return helper.validator(city, cityUpdateSchema) }

 