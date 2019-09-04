const Joi = require('joi');
const helper = require('../utils/helper');

const eventOrganizerCreateSchema = Joi.object({
    name:Joi.string().required(),
    mobile:Joi.string().required()
})
const eventOrganizerUpdateSchema = Joi.object({
    name:Joi.string().optional(),
    mobile:Joi.string().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(eventType) { return helper.validator(eventType, eventOrganizerCreateSchema) }
function verifyUpdate(eventType) { return helper.validator(eventType, eventOrganizerUpdateSchema) }

