const Joi = require('joi');
const helper = require('../utils/helper');
const categoryAttributeUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    values: Joi.array().items(Joi.string()).optional()
})

const categoryAttributeCreateSchema = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    values: Joi.array().items(Joi.string().required()).required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(attribute) { return helper.validator(attribute, categoryAttributeCreateSchema) }
function verifyUpdate(attribute) { return helper.validator(attribute, categoryAttributeUpdateSchema) }