const Joi = require('joi');
const helper = require('../utils/helper');
const orderCreateSchema = Joi.object({
    placed_to: Joi.string().required(),
    products: Joi.array().items({
        // accepted: Joi.number().valid(0).default(0).optional(),
        product: Joi.string().required(),
        requested: Joi.number().min(1).required()
    }).required(),
    // remarks:Joi.object({
    //     acceptOrder:Joi.object({
    //         // acceptedBy:Joi.string().required(),
    //         image:Joi.string().optional(),
    //         // at:{type:Date},
    //         note:Joi.string().optional()
    //     }),
    //     generateChallan:Joi.object({
    //         // generatedBy:Joi.string().required(),
    //         image:Joi.string().optional(),
    //         // at:{type:Date},
    //         note:Joi.string().optional()
    //     }),
    //     acceptChallan:Joi.object({
    //         // acceptedBy:Joi.string().required(),
    //         image:Joi.string().optional(),
    //         // at:{type:Date},
    //         note:Joi.string().optional()
    //     }),
    //     recieveOrder:Joi.object({
    //         // recievedBy:Joi.string().required(),
    //         image:Joi.string().optional(),
    //         // at:{type:Date},
    //         note:Joi.string().optional()
    //     }),
    //     billOrder:Joi.object({
    //         // billedBy:Joi.string().required(),
    //         image:Joi.string().optional(),
    //         // at:{type:Date},
    //         note:Joi.string().optional()
    //     })
    // }),
    notes: Joi.string().optional().allow('')
})
const orderAcceptSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        accepted: Joi.number().required()
    }).required(),
    'remarks.acceptOrder': Joi.object({
        // acceptedBy:Joi.string().required(),
        image: Joi.string().optional(),
        note: Joi.string().optional()
    }).optional()
})

const orderUpdateStatusSchema = Joi.object({
    // placed_to: Joi.string().required(),
    // products: Joi.array().items({
    //     product: Joi.string().required(),
    //     requested: Joi.number().min(1).required(),
    //     accepted: Joi.number().min(0).required()
    // }).required(),
    // notes: Joi.optional().allow(''),
    status: Joi.string().required()
})
const orderBetweenDates = Joi.object({
    date1:Joi.date().required(),
    date2:Joi.date().required()
})
const orderRecievedSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        recieved: Joi.number().required()
    }).required(),
    'remarks.recieveOrder': Joi.object({
        // recievedBy:Joi.string().required(),
        image: Joi.string().optional(),
        note: Joi.string().optional()
    }).optional()
})
const orderBilledSchema = Joi.object({
    products: Joi.array().items({
        product: Joi.string().required(),
        billed: Joi.number().required()
    }).required(),
    'remarks.billOrder': Joi.object({
        // recievedBy:Joi.string().required(),
        image: Joi.string().optional(),
        note: Joi.string().optional()
    }).optional()
})
module.exports = {
    verifyCreate: verifyCreate,
    // verifyUpdateStatus,
    verifyAccept,
    verifyRecieve,
    verifyBill,
    verifyDateBetween
}
function verifyCreate(order) { return helper.validator(order, orderCreateSchema) }
// function verifyUpdateStatus(order) { return helper.validator(order, orderUpdateStatusSchema) }
function verifyAccept(order) { return helper.validator(order, orderAcceptSchema) }
function verifyRecieve(order) { return helper.validator(order, orderRecievedSchema) }
function verifyBill(order) { return helper.validator(order, orderBilledSchema) }
function verifyDateBetween(order) { return helper.validator(order, orderBetweenDates) }