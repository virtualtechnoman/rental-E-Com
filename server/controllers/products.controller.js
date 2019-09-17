const Joi = require('joi');
const helper = require('../utils/helper');

const newProductSchema = Joi.object({
    image: Joi.string().optional().allow(''),
    name: Joi.string().required(),
    category: Joi.string().required(),
    attributes: Joi.array().items(Joi.object({
        name:Joi.string(),
        value:Joi.string().allow('')
    }).required()).required(),
    farm_price: Joi.number().optional(),
    is_active: Joi.boolean().required(),
    selling_price: Joi.number().required(),
    brand: Joi.string().required(),
    details: Joi.string().optional().allow(''),
    available_for: Joi.array().items(Joi.string().optional()).optional()
})

const updateProductSchema = Joi.object({
    available_for: Joi.array().items(Joi.string()).optional(),
    brand: Joi.string().optional(),
    category: Joi.string().optional(),
    attributes: Joi.array().items(Joi.object({
        name:Joi.string(),
        value:Joi.string().allow('')
    })).optional(),
    details: Joi.string().optional(),
    farm_price: Joi.number().optional(),
    is_active: Joi.boolean().optional(),
    image: Joi.string().optional(),
    name: Joi.string().optional(),
    selling_price: Joi.number().optional()
})



module.exports = {
    verifyUpdate(product) {
        return helper.validator(product, updateProductSchema);
    },
    verifyCreate(product) {
        return helper.validator(product, newProductSchema)
    }
}
//  {
//     insert
// }

// function insert(product) { return helper.validator(product, productSchema) }
