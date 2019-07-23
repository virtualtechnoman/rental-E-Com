const Joi = require('joi');
const helper = require('../utils/helper');

const buSchema = Joi.object({
    bu_name: Joi.string().required(),
    bu_id: Joi.string().required(),
    is_active: Joi.boolean().required(),
})

module.exports = {
    insert
}

function insert(bu) { return helper.validator(bu, buSchema) }

