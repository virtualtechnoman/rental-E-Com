const Joi = require('joi');
const helper = require('../utils/helper');

const attendanceCreateSchema = Joi.object({
    // user:Joi.string().required(),
    date:Joi.date().required()
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

function verifyCreate(area) { return helper.validator(area, attendanceCreateSchema) }
function verifyUpdate(area) { return helper.validator(area, areaUpdateSchema) }

