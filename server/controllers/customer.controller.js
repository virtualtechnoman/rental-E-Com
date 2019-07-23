const Joi = require('joi');
const helper = require('../utils/helper');


const customerSchema = Joi.object({
    city_name: Joi.string().required(),
    customer_id: Joi.string().required(),
    customer_name: Joi.string().required(),
    distirbutor_1_name: Joi.string().required(),
    distirbutor_2_name: Joi.string().optional().allow(''),
    distirbutor_3_name: Joi.string().optional().allow(''),
    share_1: Joi.number().required(),
    share_2: Joi.number().optional().allow(''),
    share_3: Joi.number().optional().allow(''),
    district_name: Joi.string().required(),
    is_active: Joi.boolean().required(),
    customer_type: Joi.string().required(),
    sector: Joi.string().required(),
    region_name: Joi.string().required(),
    notes: Joi.string().optional().allow('')
})


module.exports = {
    insert
}

function insert(customer) {
    return helper.validator(customer, customerSchema)
}
