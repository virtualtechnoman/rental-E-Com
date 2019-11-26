const Joi = require('joi');
const helper = require('../utils/helper');
const categoryAttributeUpdateSchema = Joi.object({
    name: Joi.string().required(),
    is_active: Joi.boolean().required().default(false),
    options: Joi.array().optional(),
    // values: Joi.array().items(Joi.string()).optional()
})

const categoryAttributeCreateSchema = Joi.object({
    name: Joi.string().required(),
    is_active: Joi.boolean(),
    options: Joi.array().required(),
    // values: Joi.array().items(Joi.string().required()).required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(attribute) { return helper.validator(attribute, categoryAttributeCreateSchema) }
function verifyUpdate(attribute) { return helper.validator(attribute, categoryAttributeUpdateSchema) }