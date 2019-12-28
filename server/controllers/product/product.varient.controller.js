const Joi = require('joi');
const helper = require('../../utils/helper');

const productVarientCreateSchema = Joi.object({
    attributes: Joi.array().items(Joi.object({
        attribute: Joi.string().required(),
        option: Joi.string().required(),
    })).required(),
    description: Joi.string().optional(),
    images: Joi.any().optional(),
    price: Joi.number().required().default(0).min(0).max(9999),
    product: Joi.string().required(),
    rent_per_day: Joi.number().default(0).min(0).max(999).optional().allow(''),
    deposit_amount: Joi.number().default(0).min(0).max(9999).optional().allow(''),
    stock: Joi.number().required().default(0).min(0).max(999)
    // is_active: Joi.boolean().required()
})
const productVarientUpdateSchema = Joi.object({
    // product: Joi.string().optional(),
    attributes: Joi.array().items(Joi.object({
        attribute: Joi.string().required(),
        option: Joi.string().required(),
    })).required(),
    description: Joi.string().optional(),
    price: Joi.number().optional().default(0).min(0).max(999),
    images: Joi.any().optional(),
    stock: Joi.number().optional().default(0).min(0).max(999),
    rent_per_day: Joi.number().default(0).min(0).max(9999).optional().allow(''),
    deposit_amount: Joi.number().default(0).min(0).max(9999).optional().allow(''),
    // is_active: Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(area) { return helper.validator(area, productVarientCreateSchema) }
function verifyUpdate(area) { return helper.validator(area, productVarientUpdateSchema) }

