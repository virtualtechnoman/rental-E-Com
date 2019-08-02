const Joi = require('joi');
const helper = require('../utils/helper');

const newProductSchema = Joi.object({
    image: Joi.string().required(),
    // business_unit_id: Joi.string().required(),
    name: Joi.string().required(),
    category: Joi.string().required(),
    // is_active: Joi.boolean().required(),
    farm_price: Joi.number().required(),
    selling_price:Joi.number().required(),
    brand: Joi.string().required(),
    product_dms: Joi.string().required(),
    details: Joi.string().required(),
    created_by: Joi.string().required(),
    available_for: Joi.string().required()
})
const updateProductSchema = Joi.object({
    image: Joi.string().optional(),
    _id:Joi.string().required(),
    name: Joi.string().optional(),
    category: Joi.string().optional(),
    farm_price: Joi.number().optional(),
    selling_price:Joi.number().optional(),
    brand: Joi.string().optional(),
    product_dms: Joi.string().optional(),
    details: Joi.string().optional(),
    created_by: Joi.string().optional(),
    available_for: Joi.string().optional()
})



module.exports = {
     verifyUpdate(product){
        return helper.validator(product,updateProductSchema);
    },
    verifyCreate(product){
        return helper.validator(product,newProductSchema)
    }
}
//  {
//     insert
// }

// function insert(product) { return helper.validator(product, productSchema) }
