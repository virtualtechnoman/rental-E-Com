const Joi = require('joi');
const helper = require('../../utils/helper');

const productVarientCreateSchema = Joi.object({
    product: Joi.string().required(),
    attributes: Joi.array().required(),
    is_active: Joi.boolean().required()
})
const productVarientUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    attributes: Joi.array().optional().allow(''),
    is_active: Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(area) { return helper.validator(area, productVarientCreateSchema) }
function verifyUpdate(area) { return helper.validator(area, productVarientUpdateSchema) }

