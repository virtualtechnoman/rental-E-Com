const Joi = require('joi');
const helper = require('../utils/helper');
const chatCreateSchema = Joi.object({
    message:Joi.string().required()
})

const chatUpdateSchema = Joi.object({
    message:Joi.string().required()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}


function verifyCreate(order) { return helper.validator(order, chatCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, chatUpdateSchema) }

