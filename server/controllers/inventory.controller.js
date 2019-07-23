const Joi = require('joi');
const helper = require('../utils/helper');

const inventorySchema = Joi.object({
    batch_no: Joi.string().required(),
    expiry_date: Joi.date().required(),
    is_active: Joi.boolean().required(),
    notes: Joi.string().optional().allow(''),
    quantity: Joi.string().required(),
    region: Joi.string().required(),
    sku: Joi.string(),
    sku_id: Joi.string().required()
})

module.exports = {
    insert
}

function insert(inventory) { return helper.validator(inventory, inventorySchema) }

