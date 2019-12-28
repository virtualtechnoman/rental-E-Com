const Joi = require('joi');
const helper = require('../utils/helper');

const routeCreateSchema = Joi.object({
    name:Joi.string().required(),
    delivery_boy:Joi.string().required(),
    is_active:Joi.boolean().required()
})
const routeUpdateSchema = Joi.object({
    name:Joi.string().optional(),
    delivery_boy:Joi.string().optional(),
    is_active:Joi.boolean().optional()
})
const updateCustomerRoute = Joi.object({
    route:Joi.string().required(),
    customers:Joi.array().items(Joi.string().required()).required()
})

module.exports = {
    verifyCreate,
    verifyUpdate,
    verifyUpdateCustomer
}

function verifyCreate(route) { return helper.validator(route, routeCreateSchema) }
function verifyUpdate(route) { return helper.validator(route, routeUpdateSchema) }
function verifyUpdateCustomer(route) { return helper.validator(route, updateCustomerRoute) }

