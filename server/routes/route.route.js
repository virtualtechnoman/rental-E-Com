const Route = require("../models/route.model");
const User = require("../models/user.model");
const RouteController = require("../controllers/route.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");

// Get all route
router.get("/", authorizePrivilege("GET_ALL_ROUTES"), (req, res) => {
    Route.find().populate("delivery_boy", "-password").exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All routes" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No route found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting routes" })
    })
})

//Add new route
router.post('/', authorizePrivilege("ADD_NEW_ROUTE"), async (req, res) => {
    let result = RouteController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    Route.findOne({ delivery_boy: result.data.delivery_boy }).exec().then(_route => {
        if (_route) {
            return res.status(400).json({ status: 400, data: null, errors: true, message: `Delivery Boy  already assigned to route : ${_route.name}` });
        } else {
            let newState = new Route(result.data);
            newState.save().then(route => {
                route.populate("delivery_boy", "-password").execPopulate().then(route => {
                    res.json({ status: 200, data: route, errors: false, message: "Route added successfully" });
                }).catch(e => {
                    console.log(e);
                    res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating" });
                });
            }).catch(e => {
                console.log(e);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding route" });
            });
        }
    }).catch(err=>{
        console.log(err);
        return res.status(500).json({status:500, data:null, errors:true, message:"Error while verifying details"});
    })
});

//Update given customers routes
router.put("/customer", (req, res) => {
    let result = RouteController.verifyUpdateCustomer(req.body);
    console.log("RESULT: ", result.errors);
    if (isEmpty(result.errors)) {
        User.updateMany({ _id: { $in: result.data.customers } }, { $set: { route: result.data.route } }).exec().then(data => {
            res.json({ message: "Selected record updated successfully", data, status: 200, errors: false })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, data: null, message: "Error while updating records", errors: true });
        })
    } else {
        res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
})

//Update a route
router.put("/id/:id", authorizePrivilege("UPDATE_ROUTE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = RouteController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        Route.findByIdAndUpdate(req.params.id, result.data, { new: true }).populate("delivery_boy", "-password").exec()
            .then(doc => {
                res.status(200).json({ status: 200, data: doc, errors: false, message: "Route Updated Successfully" });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating route" })
            })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid route id" });
    }
})

//DELETE A route
router.delete("/:id", authorizePrivilege("DELETE_ROUTE"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid route id" });
    }
    else {
        Route.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the route" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Route deleted successfully!" });
            }
        })
    }
})

module.exports = router;