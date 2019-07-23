const Joi = require('joi');
const helper = require('../utils/helper');

const companySchema = Joi.object({
    country_id:Joi.string().required(),
    country_name: Joi.string().required(),
    is_active: Joi.boolean().required()
})

module.exports = {
    insert
}

function insert(company) { return helper.validator(company, companySchema) }

