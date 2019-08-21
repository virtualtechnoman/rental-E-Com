const Joi = require('joi');
const helper = require('../utils/helper');
const orderCreateSchema = Joi.object({
    placed_to:Joi.string().required(),
    products:Joi.array().items({
        product:Joi.string().required(),
        requested:Joi.number().min(1).required()
    }).required(),
    status:Joi.boolean().required()
})

const orderUpdateSchema = Joi.object({
    // placed_to:Joi.string().optional(),
    // products:Joi.array().items({
    //     product:Joi.string().required(),
    //     quantity:Joi.number().min(1).required()
    // }),
    status:Joi.boolean().optional()
})
module.exports={
    verifyCreate:verifyCreate,
    verifyUpdate:verifyUpdate
}

function verifyCreate(order) { return helper.validator(order, orderCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, orderUpdateSchema) }