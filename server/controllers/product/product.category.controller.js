const Joi = require('joi');
const helper = require('../../utils/helper')
const categoryCreateSchema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required(),
    is_active: Joi.boolean().optional()
});

const categoryUpdateSchema = Joi.object({
    name: Joi.string().optional(),
});

const SubCategoryCreateSchema = Joi.object({
    name: Joi.string().required(),
    parent: Joi.string().required(),
    type: Joi.string().required(),
    is_active: Joi.boolean().optional()
});

module.exports = {
    verifyCreate,
    verifyUpdate,
    verifyCreateSubcateogry
}

function verifyCreate(order) { return helper.validator(order, categoryCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, categoryUpdateSchema) }
function verifyCreateSubcateogry(order) { return helper.validator(order, SubCategoryCreateSchema) }