const Joi = require('joi');
const helper = require('../../utils/helper');

const productTypeCreateSchema = Joi.object({
    name: Joi.string().required(),
    attributes: Joi.array().required(),
    is_active: Joi.boolean().required()
})
const productTypeUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    attributes: Joi.array().optional().allow(''),
    is_active: Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(area) { return helper.validator(area, productTypeCreateSchema) }
function verifyUpdate(area) { return helper.validator(area, productTypeUpdateSchema) }

