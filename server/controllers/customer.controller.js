const Joi = require('joi');
const helper = require('../utils/helper');


const customerSelfUpdateSchema = Joi.object({
    full_name: Joi.string().required(),
    landmark: Joi.string().required(),
    street_address: Joi.string().required(),
    city : Joi.string().required(),
    dob : Joi.date().optional(),
    anniversary: Joi.date().optional()

})
const customerUpdateSchema = Joi.object({
    full_name: Joi.string().required(),
    landmark: Joi.string().required(),
    street_address: Joi.string().required(),
    city : Joi.string().required(),
    dob : Joi.string().optional(),
    anniversary: Joi.date().optional(),
    role:Joi.string().optional()
})


module.exports = {
    verifyProfileUpdateSelf,
    verifyProfileUpdate
}

function verifyProfileUpdateSelf(customer) {
    return helper.validator(customer, customerSelfUpdateSchema)
}
function verifyProfileUpdate(customer) {
    return helper.validator(customer, customerUpdateSchema)
}
