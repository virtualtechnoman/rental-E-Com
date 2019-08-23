const Joi = require('joi');
const helper = require('../utils/helper');
const cartUpdateSchema = Joi.object({
    quantity: Joi.number().min(1).required()
})

const ticketCreateSchema = Joi.object({
    // ticket_number: Joi.string().required(),
    // created_by: { type: String, required: true },
    issues: {
        issue_with_previous_order: Joi.boolean().required(),
        recharge_or_tech_related_issue: Joi.boolean().required(),
        delivery_issue: Joi.boolean().required(),
        quality_issue: Joi.boolean().required(),
        timing_issue: Joi.boolean().required(),
        other: Joi.boolean().required()
    },
    note: Joi.string().required()
    // created_at: { type: Date, default: Date.now },
    // status: { type: String, default: "Pending" }
})

module.exports = {
    verifyCreate,
    verifyUpdate
}

function verifyCreate(ticket) { return helper.validator(order, ticketCreateSchema) }
function verifyUpdate(ticket) { return helper.validator(order, cartUpdateSchema) }