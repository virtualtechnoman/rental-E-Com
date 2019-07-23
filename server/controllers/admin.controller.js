const Joi = require('joi');
const helper = require('../utils/helper');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports = {
    insert
}

function insert(admin) { return helper.validator(admin, loginSchema) }