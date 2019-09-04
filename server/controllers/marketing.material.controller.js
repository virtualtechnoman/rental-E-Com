const Joi = require('joi');
const helper = require('../utils/helper');

const marketingMaterialCreateSchema = Joi.object({
    name:Joi.string().required()
})
const marketingMaterialUpdate = Joi.object({
    name:Joi.string().required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(eventType) { return helper.validator(eventType, marketingMaterialCreateSchema) }
function verifyUpdate(eventType) { return helper.validator(eventType, marketingMaterialUpdate) }

