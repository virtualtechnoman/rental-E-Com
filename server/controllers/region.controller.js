const Joi = require('joi');
const helper = require('../utils/helper');

const regionSchema = Joi.object({
    country: Joi.string().required(),
    region_id: Joi.string().required(),
    region_name: Joi.string().required(),
    is_active: Joi.boolean().required()
})

module.exports = {
    insert
}

function insert(region) { return helper.validator(region, regionSchema) }

