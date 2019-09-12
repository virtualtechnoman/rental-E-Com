const Joi = require('joi');
const helper = require('../utils/helper');

const Product = Joi.object({
    product: Joi.string().required(),
    quantity: Joi.number().required()
})
const MarketingMaterial = Joi.object({
    material:Joi.string().required(),
    quantity:Joi.number().required()
})
const eventCreateSchema = Joi.object({
    type: Joi.string().required(),
    name: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    organizer: Joi.string().required(),
    incharge: Joi.array().items(Joi.string().required()).required(),
    phone: Joi.string().required(),
    marketingMaterial: Joi.array().items(MarketingMaterial).required(),
    cost: Joi.number().positive(),
    time: Joi.date().required(),
    targetLeads: Joi.number().positive().allow(0),
    targetConversion: Joi.number(),
    farm: Joi.string().required(),
    products:Joi.array().items(Product).required(),
    hub: Joi.string().required(),
    status: Joi.string().required()
})
function verifyCreate(event) { return helper.validator(event, eventCreateSchema) }
module.exports = {
    verifyCreate
}