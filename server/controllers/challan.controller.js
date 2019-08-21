const Joi = require('joi');
const helper = require('../utils/helper');
const challanCreateSchema = Joi.object({
    dispatch_processing_unit: Joi.string().required(),
    products: Joi.array().items({
        product: Joi.string().required(),
        requested: Joi.number().min(1).required(),
        accepted: Joi.number().optional(),
        // dispatch: Joi.boolean().required()
    }).required(),
    // truck: Joi.object({
    vehicle:Joi.string().required(),
    driver:Joi.string().required(),
    status: Joi.boolean().required().default(false),
    departure: Joi.date().required()
    // }).required()
})

const challanUpdateSchema = Joi.object({
    // placed_to:Joi.string().required(),
    // products:Joi.array().items({
    //     product:Joi.string().required(),
    //     quantity:Joi.number().min(1).required()
    // }),
    status:Joi.boolean().required()
})

module.exports = {
    verifyCreate: verifyCreate,
    verifyUpdate: verifyUpdate,
    challanCreateSchema
}


function verifyCreate(order) { return helper.validator(order, challanCreateSchema) }
function verifyUpdate(order) { return helper.validator(order, challanUpdateSchema) }



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