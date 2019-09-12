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
    event: Joi.string().required(),
    status:Joi.string().required(),
    callStatus:Joi.string().required()
})
const eventLeadCommentSchema = Joi.object({
    callStatus: Joi.string().required(),
    status: Joi.string().required(),
    comments: Joi.object({
        comment: Joi.string().required(),
        nextDate: Joi.date().required()
    }).required()
})
// const eventLeadStatusChangeSchema = Joi.object({
//     status: Joi.string().required()
// })
function verifyCreate(lead) { return helper.validator(lead, eventLeadCreateSchema) }
function verifyComment(lead) { return helper.validator(lead, eventLeadCommentSchema) }
// function verifyStatusUpdate(lead) { return helper.validator(lead, eventLeadStatusChangeSchema) }
module.exports = {
    verifyCreate,
    verifyComment,
    // verifyStatusUpdate
}