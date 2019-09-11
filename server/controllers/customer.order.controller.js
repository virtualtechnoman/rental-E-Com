const Joi = require('joi');
const helper = require('../utils/helper');
const customerOrderCreateSchema = Joi.object({
    // placed_by:Joi.string().required(),
    // placed_to: Joi.string().required(),
    products: Joi.array().items({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required()
    }).required()
    // notes: Joi.optional().allow(''),
    // status: Joi.boolean().default(false),
})

const customerOrderUpdateSchema = Joi.object({
    placed_to: Joi.string().optional(),
    products: Joi.array().items({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required()
    }).optional(),
    // notes: Joi.optional().allow(''),
    // status: Joi.boolean().required()
    status: Joi.string().optional()
})
const getCustomerOrderByDateForDboySchema = Joi.object({
    date: Joi.date().required()
})
const CancelOrderByDBoyReasonSchema = Joi.object({
    doorNotOpen: Joi.boolean().required(),
    notAcceptedByCustomer: Joi.boolean().required(),
    noMilkAvailable: Joi.boolean().required(),
    other: Joi.boolean().required(),
    reason: Joi.string().required().allow("")
})

module.exports = {
    verifyCreate,
    verifyUpdate,
    verifyDateForDboy,
    verifyCancelByDboy
}

function verifyCreate(order) { return helper.validator(order, customerOrderCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, customerOrderUpdateSchema) }
function verifyDateForDboy(order) { return helper.validator(order, getCustomerOrderByDateForDboySchema) }
function verifyCancelByDboy(order) { return helper.validator(order, CancelOrderByDBoyReasonSchema) }