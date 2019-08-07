const Joi = require('joi');
const helper = require('../utils/helper');
const challanCreateSchema = Joi.object({
    placed_to:Joi.string().required(),
    products:Joi.array().items({
        product:Joi.string().required(),
        quantity:Joi.number().min(1).required()
    })
})

const challanUpdateSchema = Joi.object({
    // placed_to:Joi.string().required(),
    // products:Joi.array().items({
    //     product:Joi.string().required(),
    //     quantity:Joi.number().min(1).required()
    // }),
    // status:Joi.string().required()
})

module.exports={
    verifyCreate:verifyCreate,
    verifyUpdate:verifyUpdate
}

function verifyCreate(order) { return helper.validator(order, challanCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, challanUpdateSchema) }