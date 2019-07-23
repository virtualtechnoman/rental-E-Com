const Joi = require('joi');
const helper = require('../utils/helper');

const productSchema = Joi.object({
    brand: Joi.string().required(),
    business_unit: Joi.string().required(),
    // business_unit_id: Joi.string().required(),
    cif_price: Joi.string().required(),
    distirbutor: Joi.string().required(),
    is_active: Joi.boolean().required(),
    form: Joi.string().required(),
    notes: Joi.string().optional().allow(''),
    pack_size: Joi.string().required(),
    promoted: Joi.boolean().required(),
    range: Joi.string().required(),
    registered: Joi.boolean().required(),
    sku_id: Joi.string().required(),
    sku_name: Joi.string().required(),
    strength: Joi.string().required(),
    therapy_line: Joi.string().required(),
    whole_price: Joi.string().required()
})


module.exports = {
    insert
}

function insert(product) { return helper.validator(product, productSchema) }
