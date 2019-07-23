const Joi = require('joi');
const helper = require('../utils/helper');

const disSchema = Joi.object({
    distirbutor_name: Joi.string().required(),
    distirbutor_id: Joi.string().required(),
    is_active: Joi.boolean().required(),
})

module.exports = {
    insert
}

function insert(dis) { return helper.validator(dis, disSchema) }

