const Joi = require('joi');
const helper = require('../utils/helper');
const orderCreateSchema = Joi.object({
    placed_to:Joi.string().required(),
    products:Joi.array().items({
        product:Joi.string().required(),
        requested:Joi.number().min(1).required()
    }).required(),
    notes: Joi.string().optional().allow('')
})

const returnOrderRecieveSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        recieved: Joi.number().required()
    }).required()
})
const returnOrderBilledSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        billed: Joi.number().required()
    }).required()
})

module.exports={
    verifyCreate,
    verifyRecieve,
    verifyBill
}

function verifyCreate(order) { return helper.validator(order, orderCreateSchema) }
function verifyRecieve(order) { return helper.validator(order, returnOrderRecieveSchema) }
function verifyBill(order) { return helper.validator(order, returnOrderBilledSchema) }