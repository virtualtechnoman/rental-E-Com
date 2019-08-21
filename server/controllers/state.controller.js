const Joi = require('joi');
const helper = require('../utils/helper');

const stateCreateSchema = Joi.object({
    name:Joi.string().required(),
    is_active:Joi.boolean().required()
})
const stateUpdateSchema = Joi.object({
    name:Joi.string().optional(),
    is_active:Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(state) { return helper.validator(state, stateCreateSchema) }
function verifyUpdate(state) { return helper.validator(state, stateUpdateSchema) }

