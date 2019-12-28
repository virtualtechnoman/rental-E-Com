const Joi = require('joi');
const helper = require('../utils/helper');
const cartUpdateSchema = Joi.object({
    quantity: Joi.number().min(1).required()
})

const cartAddSchema = Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    startRentDate: Joi.date().optional(),
    endRentDate: Joi.date().optional()
})

module.exports = {
    verifyAdd,
    verifyUpdate
}

function verifyAdd(order) { return helper.validator(order, cartAddSchema) }
function verifyUpdate(order) { return helper.validator(order, cartUpdateSchema) }