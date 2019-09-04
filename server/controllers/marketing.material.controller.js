const Joi = require('joi');
const helper = require('../utils/helper');

const marketingMaterialCreateSchema = Joi.object({
    name:Joi.string().required()
})
const eventTypeUpdateSchema = Joi.object({
    name:Joi.string().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(eventType) { return helper.validator(eventType, marketingMaterialCreateSchema) }
function verifyUpdate(eventType) { return helper.validator(eventType, eventTypeUpdateSchema) }

