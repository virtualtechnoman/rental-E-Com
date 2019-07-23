const Joi = require('joi');
const helper = require('../utils/helper');

const SalesSchema = Joi.object({
    customer_name:Joi.string().required(),
    customer_id: Joi.string().required(),
    discount: Joi.string().required(),
    gross_amount:Joi.string().required(),
    foc: Joi.string().required(),
    invoice: Joi.string().required(),
    invoice_date: Joi.string().required(),
    net_price: Joi.string().required(),
    product_id:Joi.string().required(),
    product_name: Joi.string().required(),
    price: Joi.string().required(),
    quantity: Joi.string().required(),
    region:Joi.string().required(),
    sector: Joi.string().required(),
    is_active: Joi.boolean().required()
})

module.exports = {
    insert
}

function insert(sales) { return helper.validator(sales, SalesSchema) }

