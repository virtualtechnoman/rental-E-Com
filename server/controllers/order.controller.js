const Joi = require('joi');
const helper = require('../utils/helper');
const orderCreateSchema = Joi.object({
    // placed_by:Joi.string().required(),
    placed_to: Joi.string().required(),
    products: Joi.array().items({
        accepted: Joi.number().default(0).optional(),
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required()
    }),
    notes: Joi.optional().allow(''),
    status: Joi.boolean().default(false),
})

const orderUpdateSchema = Joi.object({
    placed_to: Joi.string().required(),
    products: Joi.array().items({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        accepted: Joi.number().min(0).required()
    }),
    notes: Joi.optional().allow(''),
    status: Joi.boolean().required()
    // status:Joi.string().required()
})

module.exports = {
    verifyCreate: verifyCreate,
    verifyUpdate: verifyUpdate
}

function verifyCreate(order) { return helper.validator(order, orderCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, orderUpdateSchema) }