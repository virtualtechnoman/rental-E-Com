const Joi = require('joi');
const helper = require('../utils/helper');

const IncentiveShareSchema = Joi.object({
    celing: Joi.number().required(),
    floor: Joi.number().required(),
    therapyline_id: Joi.string().required(),
    shares: Joi.array().required()
})

module.exports = {
    insert
}

function insert(IncentiveShare) { return helper.validator(IncentiveShare, IncentiveShareSchema) }

