const Joi = require('joi');
const helper = require('../utils/helper');

const customer_type_schema = Joi.object({
    customer_id: Joi.string().required(),
    customer_type: Joi.string().required(),
    is_active: Joi.boolean().required()
})

module.exports = { insert }

function insert(customer_type) { return helper.validator(customer_type, customer_type_schema) }

