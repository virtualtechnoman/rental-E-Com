const Joi = require('joi');
const helper = require('../utils/helper');

const targetSchema = Joi.object({
    product_id: Joi.string().required(),
    product_name: Joi.string().required(),
    customer_id: Joi.string().required(),
    customer_name: Joi.string().required(),
    customer_type: Joi.string(),
    jan: Joi.string(),
    feb: Joi.string(),
    mar: Joi.string(),
    apr: Joi.string(),
    may: Joi.string(),
    jun: Joi.string(),
    jul: Joi.string(),
    aug: Joi.string(),
    sep: Joi.string(),
    oct: Joi.string(),
    nov: Joi.string(),
    dec: Joi.string(),
    // is_active: Joi.boolean().required()
})

module.exports = { insert }

function insert(target) { return helper.validator(target, targetSchema) }

