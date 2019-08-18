const Joi = require('joi');
const helper = require('../utils/helper');
const categoryUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    is_active:Joi.boolean().optional()
})

const categoryCreateSchema = Joi.object({
    name: Joi.string().required(),
    is_active:Joi.boolean().required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(order) { return helper.validator(order, categoryCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, categoryUpdateSchema) }