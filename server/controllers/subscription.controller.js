const Joi = require('joi');
const helper = require('../utils/helper');

const subscriptionCreateSchema = Joi.object({
    product:Joi.string().required(),
    startDate:Joi.date().required(),
    quantity:Joi.number().positive().required(),
    frequencyDates:Joi.array().items(Joi.date()).required()
})
const subscriptionCreateWebSchema = Joi.object({
    product:Joi.string().required(),
    user:Joi.string().required(),
    startDate:Joi.date().required(),
    quantity:Joi.number().positive().required(),
    frequencyDates:Joi.array().items(Joi.date().required()).required()
})
const subscriptionUpdateSchema = Joi.object({
    product:Joi.string().required(),
    startDate:Joi.date().required(),
    quantity:Joi.number().positive().required(),
    frequencyDates:Joi.array().items(Joi.date()).required()
})

module.exports = {
    verifyCreate,
    verifyUpdate,
    verifyCreateWeb
}

function verifyCreate(subscription) { return helper.validator(subscription, subscriptionCreateSchema) }
function verifyCreateWeb(subscription) { return helper.validator(subscription, subscriptionCreateWebSchema) }
function verifyUpdate(subscription) { return helper.validator(subscription, subscriptionUpdateSchema) }

