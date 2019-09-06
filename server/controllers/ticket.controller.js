const Joi = require('joi');
const helper = require('../utils/helper');
const cartUpdateSchema = Joi.object({
    quantity: Joi.number().min(1).required()
})



const ticketFollowUp = Joi.object({
    followUpComments: Joi.string().required(),
    actionTaken: Joi.string().required(),
    assignTo: Joi.string().optional()
})
// function verifyCustomerMsg(ticket) { return helper.validator(ticket, ticketMsgCustomer) }

const ProductConcern = Joi.object({
    milkComposition: Joi.object({
        thinMilklessFat: Joi.boolean(),
        thickMilkMoreFat: Joi.boolean(),
    }),
    impuritiesInMilk: Joi.object({
        insectInMilk: Joi.boolean(),
        siltInMilk: Joi.boolean(),
        blackParticle: Joi.boolean(),
    }),
    packaging: Joi.object({
        bottleBrokeOrChipped: Joi.boolean(),
        sealBroken: Joi.boolean(),
        dirtyCaps: Joi.boolean(),
        noDCPLabel: Joi.boolean(),
    }),
    propertiesOfMilk: Joi.object({
        offSmell: Joi.boolean(),
        offTaste: Joi.boolean(),
        curdlingOfMilk: Joi.boolean(),
        noProperCurd: Joi.boolean(),
        notYellowInColor: Joi.boolean(),
        stickingToUtensilOnBoiling: Joi.boolean(),
    })
})
const ServiceConcern = Joi.object({
    deliverySchedule: Joi.object({
        noDelivery: Joi.boolean(),
        deliveredWithoutSubscription: Joi.boolean(),
        wrongQuantityDelivered: Joi.boolean(),
    }),
    deliveryTiming: Joi.object({
        deliveringLate: Joi.boolean(),
        deliveringEarly: Joi.boolean(),
        irregularDeliveryTime: Joi.boolean(),
    }),
    billingIssue: Joi.object({
        paidAlready: Joi.boolean(),
        wronglyBilledOnNonDeliveryDates: Joi.boolean()
    }),
    serviceIssue: Joi.object({
        notFollowedUpRaisedConcern: Joi.boolean(),
        notFollowedDeliveryInstruction: Joi.boolean(),
        didNotStartSubscriptionAsPromised: Joi.boolean()
    })
})
const CloseSubscriptionRequest = Joi.object({
    relocated: Joi.boolean(),
    costly: Joi.boolean(),
    wantA2Milk: Joi.boolean(),
    timingIssue: Joi.boolean(),
    milkCompositionIssue: Joi.boolean(),
    billingIssue: Joi.boolean(),
    healthIssue: Joi.boolean(),
    otherBrand: Joi.boolean(),
    localVendor: Joi.boolean(),
    wantBuffaloMilk: Joi.boolean(),
    noReason: Joi.boolean(),
    doctorAdvice: Joi.boolean(),
    lessConsumption: Joi.boolean()
})
const ticketCreateSchema = Joi.object({
    customer: Joi.string().required(),
    customerConcern: Joi.string().required(),
    assignTo: Joi.string().required(),
    isUrgent: Joi.boolean().optional(),
    isSubscriptionClosed: Joi.boolean().optional(),
    callType: Joi.object({
        inbound: Joi.boolean(),
        outbound: Joi.boolean()
    }).or('inbound', 'outbound'),
    customerConcernMedia: Joi.object({
        mobile: Joi.boolean(),
        whatsapp: Joi.boolean(),
        hub: Joi.boolean()
    }).or('mobile', 'whatsapp', 'hub'),
    products: Joi.object({
        milk: Joi.boolean(),
        ghee: Joi.boolean(),
        butter: Joi.boolean(),
        cheese: Joi.boolean()
    }),
    issues: Joi.object({
        productConcern: ProductConcern,
        serviceConcern: ServiceConcern,
        closeSubscriptionRequest: CloseSubscriptionRequest,
    })
})


function verifyCreate(ticket) { return helper.validator(ticket, ticketCreateSchema) }
function verifyTicketFollowUp(ticket) { return helper.validator(ticket, ticketFollowUp) }

module.exports = {
    verifyCreate,
    verifyTicketFollowUp
}
