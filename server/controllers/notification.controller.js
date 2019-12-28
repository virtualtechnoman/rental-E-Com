const Joi = require('joi');
const helper = require('../utils/helper');
const notificationCreateShcema = Joi.object({
    message: Joi.string().required(),
    users: Joi.array().items(Joi.string().required()).required()
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


function verifyCreate(notification) { return helper.validator(notification, notificationCreateShcema) }
// function verifyUpdate(brand) { return helper.validator(brand, brandUpdateSchema) }
