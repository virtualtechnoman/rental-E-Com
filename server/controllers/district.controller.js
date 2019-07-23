const Joi = require('joi');
const helper = require('../utils/helper');

const districtSchema = Joi.object({
    city: Joi.string().required(),
    district_name: Joi.string().required(),
    district_id: Joi.string().required(),
    is_active: Joi.boolean().required(),
    owner: Joi.string().required()
})

module.exports = {
    insert
}

function insert(district) { return helper.validator(district, districtSchema) }

