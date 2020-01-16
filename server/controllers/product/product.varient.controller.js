const Joi = require('joi');
const helper = require('../../utils/helper');

const productVarientCreateSchema = Joi.object({
    attributes: Joi.array().items(Joi.object({
        attribute: Joi.string().required(),
        option: Joi.string().required(),
    })).required(),
    description: Joi.string().optional(),
    images: Joi.any().optional(),
    price: Joi.number().optional(),
    product: Joi.string().required(),
    rent_per_day: Joi.number().optional(),
    deposit_amount: Joi.number().optional(),
    stock: Joi.number().required()
    // is_active: Joi.boolean().required()
})
const productVarientUpdateSchema = Joi.object({
    // product: Joi.string().optional(),
    attributes: Joi.array().items(Joi.object({
        attribute: Joi.string().required(),
        option: Joi.string().required(),
    })).required(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    images: Joi.any().optional(),
    stock: Joi.number().optional(),
    rent_per_day: Joi.number().optional(),
    deposit_amount: Joi.number().optional(),
    // is_active: Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(area) { return helper.validator(area, productVarientCreateSchema) }
function verifyUpdate(area) { return helper.validator(area, productVarientUpdateSchema) }

