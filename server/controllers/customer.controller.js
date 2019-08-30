const Joi = require('joi');
const helper = require('../utils/helper');


const customerSelfUpdateSchema = Joi.object({
    full_name: Joi.string().required(),
    landmark: Joi.string().required(),
    street_address: Joi.string().required(),
    mobile_number:Joi.string().optional(),
    // city : Joi.string().required(),
    area : Joi.string().required(),
    dob : Joi.date().optional(),
    anniversary: Joi.date().optional()

})
const customerUpdateSchema = Joi.object({
    full_name: Joi.string().optional(),
    landmark: Joi.string().optional(),
    mobile_number:Joi.string().optional(),
    street_address: Joi.string().optional(),
    // city : Joi.string().optional(),
    area : Joi.string().optional(),
    dob : Joi.date().optional(),
    anniversary: Joi.date().optional(),
    role:Joi.string().optional()
})

const customerCreateWeb = Joi.object({
    full_name:Joi.string().required(),
    mobile_number: Joi.string().required(),
    landmark: Joi.string().required(),
    street_address: Joi.string().required(),
    city : Joi.string().required(),
    dob : Joi.date().required()
})

module.exports = {
    verifyProfileUpdateSelf,
    verifyProfileUpdate,
    verifyCreateWeb
}

function verifyProfileUpdateSelf(customer) {
    return helper.validator(customer, customerSelfUpdateSchema)
}
function verifyProfileUpdate(customer) {
    return helper.validator(customer, customerUpdateSchema)
}
function verifyCreateWeb(customer) {
    return helper.validator(customer, customerCreateWeb)
}
