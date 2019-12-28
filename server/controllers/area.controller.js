const Joi = require('joi');
const helper = require('../utils/helper');

const areaCreateSchema = Joi.object({
    name:Joi.string().required(),
    city:Joi.string().required(),
    hub:Joi.string().optional(),
    is_active:Joi.boolean().required()
})
const areaUpdateSchema = Joi.object({
    name:Joi.string().optional(),
    city:Joi.string().optional(),
    hub:Joi.string().optional(),
    is_active:Joi.boolean().optional()
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(area) { return helper.validator(area, areaCreateSchema) }
function verifyUpdate(area) { return helper.validator(area, areaUpdateSchema) }

