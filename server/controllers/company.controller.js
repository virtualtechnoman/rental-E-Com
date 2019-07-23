const Joi = require('joi');
const helper = require('../utils/helper');

const companySchema = Joi.object({
    company_id:Joi.string().required(),
    company_name: Joi.string().required(),
    company_id: Joi.boolean().required()
})

module.exports = {
    insert
}

function insert(company) { return helper.validator(company, companySchema) }

