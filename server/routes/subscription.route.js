const Subscription = require("../models/subsciption.model");
const SubscriptionController = require("../controllers/subscription.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get own subscriptions
router.get("/", authorizePrivilege("GET_SUBSCRIPTIONS_OWN"), (req, res) => {
    Subscription.find({user:req.user._id}).populate({path:"product",populate:{path:"category available_for brand created_by",select:"-password"} }).exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All subscriptions" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No subscription found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting subscriptions" })
    })
})
// Get all subscriptions
router.get("/all", authorizePrivilege("GET_ALL_SUBSCRIPTIONS"), (req, res) => {
    Subscription.find().populate([{path:"product",populate:{path:"category available_for brand created_by",select:"-password"} },{path:"user",select:"-password"}]).exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All subscriptions" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No subscription found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting subscriptions" })
    })
})

//Add new subscription
router.post('/', authorizePrivilege("ADD_NEW_SUBSCRIPTION"), async (req, res) => {
    let result = SubscriptionController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    result.data.user = req.user._id;
    let newState = new Subscription(result.data);
    newState.save().then(subscription => {
        subscription.populate({path:"product",populate:{path:"category available_for brand created_by",select:"-password"} }).execPopulate().then(subscription=>{
            res.json({ status: 200, data: subscription, errors: false, message: "Subscription added successfully" })
        }).catch(e => {
            console.log(e);
            res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating" })
        });
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding subscription" })
    });
});

//Update a subscription
router.put("/:id", authorizePrivilege("UPDATE_SUBSCRIPTION"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = SubscriptionController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        Subscription.findByIdAndUpdate(req.params.id, result.data, { new: true }).populate({path:"product",populate:{path:"category available_for brand",select:"-password"} },{path:"user",select:"-password"}).exec()
            .then(subscription=>{
                    res.status(200).json({ status: 200, data: subscription, errors: false, message: "Subscription Updated Successfully" });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating subscription" })
            })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid subscription id" });
    }
})

//DELETE A subscription
router.delete("/:id", authorizePrivilege("DELETE_SUBSCRIPTION"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid subscription id" });
    }
    else {
        Subscription.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the subscription" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Area deleted successfully!" });
            }
        })
    }
})

module.exports = router;