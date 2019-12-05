const Joi = require('joi');
const helper = require('../../utils/helper');

const productVarientCreateSchema = Joi.object({
    product: Joi.string().required(),
    attributes: Joi.array().items(Joi.object({
        attribute: Joi.string().required(),
        option: Joi.string().required(),
    })).required(),
    name: Joi.string().required(),
    sku_id: Joi.string().required(),
    price: Joi.number().required(),
    stock: Joi.number().required()
    // is_active: Joi.boolean().required()
})
const productVarientUpdateSchema = Joi.object({
    // product: Joi.string().optional(),
    attributes: Joi.array().items(Joi.object({
        attribute: Joi.string().required(),
        option: Joi.string().required(),
    })).required(),
    // is_active: Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(area) { return helper.validator(area, productVarientCreateSchema) }
function verifyUpdate(area) { return helper.validator(area, productVarientUpdateSchema) }

