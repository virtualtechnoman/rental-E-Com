const Joi = require('joi');
const helper = require('../utils/helper');

const citySchema = Joi.object({
    region: Joi.string().required(),
    city_name: Joi.string().required(),
    city_id: Joi.string().required(),
    is_active: Joi.boolean().required()
})

module.exports = {
    insert
}

function insert(city) { return helper.validator(city, citySchema) }

