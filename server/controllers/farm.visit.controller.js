const Joi = require('joi');
const helper = require('../utils/helper');

const bookFarmVisit = Joi.object({
    visitors:Joi.number().positive().required(),
    reason:Joi.string().optional(),
    date:Joi.date().required()
})
// const areaUpdateSchema = Joi.object({
//     name:Joi.string().optional(),
//     city:Joi.string().optional(),
//     hub:Joi.string().optional(),
//     is_active:Joi.boolean().optional()
// })

module.exports = {
    verifyCreate,
    // verifyUpdate
}

function verifyCreate(visit) { return helper.validator(visit, bookFarmVisit) }
// function verifyUpdate(area) { return helper.validator(area, areaUpdateSchema) }

