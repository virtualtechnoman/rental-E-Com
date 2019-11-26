const Joi = require('joi');
const helper = require('../../utils/helper');

const productOptionCreateSchema = Joi.object({
    parent: Joi.string().required(),
    value: Joi.string().required()
})
const productOptionUpdateSchema = Joi.object({
    parent: Joi.string().optional(),
    value: Joi.string().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(productOption) { return helper.validator(productOption, productOptionCreateSchema) }
function verifyUpdate(productOption) { return helper.validator(productOption, productOptionUpdateSchema) }

