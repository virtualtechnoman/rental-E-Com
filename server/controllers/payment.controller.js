const Joi = require('joi');
const helper = require('../utils/helper');
const paymentCreateShcema = Joi.object({
    customer: Joi.string().required(),
    mode: Joi.string().required(),
    amount: Joi.number().required(),
    comment: Joi.string().optional()
})
// const brandUpdateSchema = Joi.object({
//     name: Joi.string().optional(),
//     contact: Joi.string().optional(),
//     address: Joi.string().optional(),
//     logo: Joi.string().optional()
// })

module.exports = {
    verifyCreate,
    // verifyUpdate
}


function verifyCreate(payment) { return helper.validator(payment, paymentCreateShcema) }
// function verifyUpdate(brand) { return helper.validator(brand, brandUpdateSchema) }
