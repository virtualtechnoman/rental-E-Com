const Joi = require('joi');
const helper = require('../utils/helper');
const challanCreateFromOrderSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        dispatched: Joi.number().required()
    }).required(),
    dispatch_processing_unit: Joi.string().required(),
    vehicle:Joi.string().required(),
    driver:Joi.string().required(),
    departure: Joi.date().required(),
    'remarks.generateChallan': Joi.object({
        // recievedBy:Joi.string().required(),
        image: Joi.string().optional(),
        note: Joi.string().optional()
    }).optional()
})

const challanCreateFromReturnOrderSchema = Joi.object({
    dispatch_processing_unit: Joi.string().required(),
    vehicle:Joi.string().required(),
    driver:Joi.string().required(),
    departure: Joi.date().required(),
    'remarks.generateChallan': Joi.object({
        // recievedBy:Joi.string().required(),
        image: Joi.string().optional(),
        note: Joi.string().optional()
    }).optional()
})

module.exports = {
    verifyCreateFromOrder,
    verifyCreateFromReturnOrder
}

function verifyCreateFromOrder(order) { return helper.validator(order, challanCreateFromOrderSchema) }
function verifyCreateFromReturnOrder(order) { return helper.validator(order, challanCreateFromReturnOrderSchema) }



// function validator(data, modelSchema) {
//     return Joi.validate(data, modelSchema, { abortEarly: false }, (err, value) => {
//         let data = {
//             errors: {},
//             data: {}
//         };
//         if (err) {
//             err.details.forEach(err => {

//                 if (err.path.length == 1) {
//                     errors[err.path[0]] = 
//                     let temp = { [err.message.split('"')[1]]: err.message }
//                     data.errors = { ...data.errors, ...temp }
//                 }else if(err.path.length == 3){

//                 }
//             })
//             return data
//         }
//         else {
//             data.data = { ...value }
//             return data
//         }
//     });
// }