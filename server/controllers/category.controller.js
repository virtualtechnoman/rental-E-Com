const Joi = require('joi');
const helper = require('../utils/helper');

const categorySchema = Joi.object({
    name: Joi.string().required()
})


module.exports = {
    insert
}

function insert(product) { return helper.validator(category, categorySchema) }