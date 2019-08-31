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
    let newState = new Route(result.data);
    newState.save().then(route => {
        route.populate("delivery_boy", "-password").execPopulate().then(route => {
            res.json({ status: 200, data: route, errors: false, message: "Area added successfully" });
        }).catch(e => {
            console.log(e);
            res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating" });
        });
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding route" });
    });
});

//Update given customers routes
router.put("/customer",(req,res)=>{
    let result = RouteController.verifyUpdateCustomer(req.body);
    if(isEmpty(result.data)){
        User.updateMany({_id:{$in:customers}},{$set:{route:result.data.route}}).exec().then(d=>{
            res.json({message:""})
        })
    }else{
        res.status(400).json({ status: 400, data: null, errors: true, message: "Fields required" });
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
                res.status(200).json({ status: 200, data: doc, errors: false, message: "Area Updated Successfully" });
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