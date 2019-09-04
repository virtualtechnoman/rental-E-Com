const mongoose = require("mongoose");

const Responses = mongoose.Schema({
    followUpComments: String,
    actionTaken: String,
    by:{type:mongoose.Schema.Types.ObjectId, ref:"user"},
    at: { type: Date, default: Date.now }
},{
    versionKey: false,
    _id: false
});
const ProductConcern = mongoose.Schema({
    milkComposition: {
        thinMilklessFat: { type: Boolean, default: false },
        thickMilkMoreFat: { type: Boolean, default: false },
    },
    impuritiesInMilk: {
        insectInMilk: { type: Boolean, default: false },
        siltInMilk: { type: Boolean, default: false },
        blackParticle: { type: Boolean, default: false },
    },
    packaging: {
        bottleBrokeOrChipped: { type: Boolean, default: false },
        sealBroken: { type: Boolean, default: false },
        dirtyCaps: { type: Boolean, default: false },
        noDCPLabel: { type: Boolean, default: false },
    },
    propertiesOfMilk: {
        offSmell: { type: Boolean, default: false },
        offTaste: { type: Boolean, default: false },
        curdlingOfMilk: { type: Boolean, default: false },
        noProperCurd: { type: Boolean, default: false },
        notYellowInColor: { type: Boolean, default: false },
        stickingToUtensilOnBoiling: { type: Boolean, default: false },
    }
}, {
        versionKey: false,
        _id: false
    });
const ServiceConcern = mongoose.Schema({
    deliverySchedule: {
        noDelivery: { type: Boolean, default: false },
        deliveredWithoutSubscription: { type: Boolean, default: false },
        wrongQuantityDelivered: { type: Boolean, default: false },
    },
    deliveryTiming: {
        deliveringLate: { type: Boolean, default: false },
        deliveringEarly: { type: Boolean, default: false },
        irregularDeliveryTime: { type: Boolean, default: false },
    },
    billingIssue: {
        paidAlready: { type: Boolean, default: false },
        wronglyBilledOnNonDeliveryDates: { type: Boolean, default: false }
    },
    serviceIssue: {
        notFollowedUpRaisedConcern: { type: Boolean, default: false },
        notFollowedDeliveryInstruction: { type: Boolean, default: false },
        didNotStartSubscriptionAsPromised: { type: Boolean, default: false }
    }
}, {
        versionKey: false,
        _id: false
    })

const CloseSubscriptionRequest = mongoose.Schema({
    relocated: { type: Boolean, default: false },
    costly: { type: Boolean, default: false },
    wantA2Milk: { type: Boolean, default: false },
    timingIssue: { type: Boolean, default: false },
    milkCompositionIssue: { type: Boolean, default: false },
    billingIssue: { type: Boolean, default: false },
    healthIssue: { type: Boolean, default: false },
    otherBrand: { type: Boolean, default: false },
    localVendor: { type: Boolean, default: false },
    wantBuffaloMilk: { type: Boolean, default: false },
    noReason: { type: Boolean, default: false },
    doctorAdvice: { type: Boolean, default: false },
    lessConsumption: { type: Boolean, default: false }
}, {
        versionKey: false,
        _id: false
    })
module.exports = mongoose.model("ticket", new mongoose.Schema({
    ticket_number: { type: String, required: true },
    customerConcern: String,
    assignTo: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    isUrgent: { type: Boolean, default: false },
    isSubscriptionClosed: { type: Boolean, default: false },
    callType: {
        inbound: { type: Boolean, default: false },
        outbound: { type: Boolean, default: false }
    },
    customerConcernMedia: {
        mobile: { type: Boolean, default: false },
        whatsapp: { type: Boolean, default: false },
        hub: { type: Boolean, default: false }
    },
    products: {
        milk: { type: Boolean, default: false },
        ghee: { type: Boolean, default: false },
        butter: { type: Boolean, default: false },
        cheese: { type: Boolean, default: false }
    },
    issues: {
        productConcern: ProductConcern,
        serviceConcern: ServiceConcern,
        closeSubscriptionRequest: CloseSubscriptionRequest
    },
    responses: [Responses],
    created_at: { type: Date, default: Date.now },
    status: { type: String, default: "Pending" }
}, {
        versionKey: false
    }))