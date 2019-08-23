const Joi = require('joi');
const helper = require('../utils/helper');
const orderCreateSchema = Joi.object({
    placed_to: Joi.string().required(),
    products: Joi.array().items({
        // accepted: Joi.number().valid(0).default(0).optional(),
        product: Joi.string().required(),
        requested: Joi.number().min(1).required()
    }).required(),
    // status:Joi.string().required(),
    notes: Joi.string().optional().allow('')
})
const orderAcceptSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        accepted: Joi.number().required()
    }).required()
})

const orderUpdateStatusSchema = Joi.object({
    // placed_to: Joi.string().required(),
    // products: Joi.array().items({
    //     product: Joi.string().required(),
    //     requested: Joi.number().min(1).required(),
    //     accepted: Joi.number().min(0).required()
    // }).required(),
    // notes: Joi.optional().allow(''),
    status: Joi.string().required()
})

module.exports = {
    verifyCreate: verifyCreate,
    verifyUpdateStatus,
    verifyAccept
}

function verifyCreate(order) { return helper.validator(order, orderCreateSchema) }
function verifyUpdateStatus(order) { return helper.validator(order, orderUpdateStatusSchema) }
function verifyAccept(order) { return helper.validator(order, orderAcceptSchema) }