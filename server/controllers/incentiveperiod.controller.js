const Joi = require('joi');
const helper = require('../utils/helper');

const IncentivePeriodSchema = Joi.object({
    therapyline_id: Joi.string().required(),
    period_type: Joi.string().required(),
    periods: Joi.array().required(),
})

module.exports = {
    insert
}

function insert(IncentivePeriod) { return helper.validator(IncentivePeriod, IncentivePeriodSchema) }

