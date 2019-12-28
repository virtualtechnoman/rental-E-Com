const Joi = require('joi');
const helper = require('../utils/helper');
const customerOrderCreateSchema = Joi.object({
    // placed_by:Joi.string().required(),
    // placed_to: Joi.string().required(),
    products: Joi.array().items({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        startRentDate: Joi.date().optional(),
        endRentDate: Joi.date().optional()
    }).required(),
})
const returnOrderSchema = Joi.object({
        product: Joi.string().required(),
        order: Joi.string().required(),
        returned:Joi.boolean().required(),
})
const depositRefundOrderSchema = Joi.object({
        product: Joi.string().required(),
        order: Joi.string().required(),
        depositRefunded:Joi.boolean().required(),
})

const customerOrderUpdateSchema = Joi.object({
    placed_to: Joi.string().optional(),
    products: Joi.array().items({
        product: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
        startRentDate: Joi.date().optional(),
        endRentDate: Joi.date().optional(),
    }).optional(),
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

const customerOrderAcceptSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        accepted: Joi.number().positive().allow(0).required()
    }).required(),
    orderStatus:Joi.string().optional().allow('')
})
module.exports = {
    verifyCreate,
    verifyUpdate,
    verifyDateForDboy,
    verifyCancelByDboy,
    verifyAccept,
    verifyReturn,
    verifyRefund
}

function verifyCreate(order) { return helper.validator(order, customerOrderCreateSchema) }
function verifyAccept(order) { return helper.validator(order, customerOrderAcceptSchema) }
function verifyUpdate(order) { return helper.validator(order, customerOrderUpdateSchema) }
function verifyReturn(order) { return helper.validator(order, returnOrderSchema) }
function verifyRefund(order) { return helper.validator(order, depositRefundOrderSchema) }
function verifyDateForDboy(order) { return helper.validator(order, getCustomerOrderByDateForDboySchema) }
function verifyCancelByDboy(order) { return helper.validator(order, CancelOrderByDBoyReasonSchema) }