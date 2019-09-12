const Joi = require('joi');
const helper = require('../utils/helper');

const eventLeadCreateSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    contact: Joi.string().required(),
    gender: Joi.string().required(),
    city: Joi.string().required(),
    address: Joi.string().required(),
    comments: Joi.object({
        comment: Joi.string().required(),
        nextDate: Joi.date().required()
    }).required(),
    mode: Joi.string().required(),
    preferredTime: Joi.date().required(),
    event: Joi.string().required()
})
const eventLeadCommentSchema = Joi.object({
    comment: Joi.object({
        comment: Joi.string().required(),
        nextDate: Joi.date().required()
    }).required()
})
function verifyCreate(lead) { return helper.validator(lead, eventLeadCreateSchema) }
function verifyComment(lead) { return helper.validator(lead, eventLeadCommentSchema) }
module.exports = {
    verifyCreate,
    verifyComment
}