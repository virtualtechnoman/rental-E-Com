const Joi = require('joi');
const helper = require('../utils/helper');

const eventLeadCreateSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    contact: Joi.string().required(),
    gender: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    comments: Joi.string().required(),
    mode: Joi.string().required(),
    event: Joi.string().required()
})
function verifyCreate(event) { return helper.validator(event, eventLeadCreateSchema) }
module.exports = {
    verifyCreate
}