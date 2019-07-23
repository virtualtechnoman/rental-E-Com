const Joi = require('joi');
const helper = require('../utils/helper');

const therapySchema = Joi.object({
    bu: Joi.string().required(),
    // bu_id: Joi.string().required(),
    is_active: Joi.boolean().required(),
    notes: Joi.string().optional().allow(''),
    therapyline: Joi.string().required(),
    therapyline_id: Joi.string().required(),
})

module.exports = {
    insert
}

function insert(therapy) { return helper.validator(therapy, therapySchema) }