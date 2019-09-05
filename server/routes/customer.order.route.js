const express = require('express');
const isEmpty = require("../utils/is-empty");
const CustomerOrderController = require('../controllers/customer.order.controller');
const CustomerOrder = require('../models/customer.order.model');
var mongodb = require("mongodb");
const moment = require('moment');
const authorizePrivilege = require("../middleware/authorizationMiddleware");
const router = express.Router();

//GET all orders placed by self
router.get("/", authorizePrivilege("GET_ALL_CUSTOMER_ORDERS_OWN"), (req, res) => {
    CustomerOrder.find({ placed_by: req.user._id }).populate("placed_by placed_to")
        .populate({
            path: "products.product ",
            populate:{
                path:"created_by category brand available_for", select:"-password"
            }
        })
        .exec().then(doc => {
            return res.json({ status: 200, data: doc, errors: false, message: "All Orders" });
        }).catch(err => {
            return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
        });
})
//GET all orders placed by a specific User
router.get("/customer/:id", authorizePrivilege("GET_ALL_CUSTOMER_ORDERS"), (req, res) => {
    CustomerOrder.find({ placed_by: req.params.id }).populate("placed_by placed_to")
        .populate({
            path: "products.product ",
            populate:{
                path:"created_by category brand available_for", select:"-password"
            }
        })
        .exec().then(doc => {
            return res.json({ status: 200, data: doc, errors: false, message: "All Orders" });
        }).catch(err => {
            return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
        });
})

//GET all orders
router.get("/all", authorizePrivilege("GET_ALL_CUSTOMER_ORDERS"), (req, res) => {
    CustomerOrder.find().populate("placed_by placed_to")
    .populate({
        path: "products.product",
        populate:{
            path:"created_by category brand available_for", select:"-password"
        }
    }).exec().then(doc => {
        return res.json({ status: 200, data: doc, errors: false, message: "All Orders" });
    }).catch(err => {
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
    });
})

// Create an order
// router.post("/", authorizePrivilege("ADD_NEW_CUSTOMER_ORDER"), (req, res) => {
//     let result = CustomerOrderController.verifyCreate(req.body);
//     if (!isEmpty(result.errors))
//         return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
//     result.data.placed_by = req.user._id;
//     result.data.order_id = "C_ORD" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
//     result.data.status = "Placed";
//     let newOrder = new CustomerOrder(result.data);
//     newOrder.save().then(order => {
//         CustomerOrder.findById(order._id).populate("placed_by products.product placed_to").exec().then(doc => {
//             res.json({ status: 200, data: doc, errors: false, message: "Order created successfully" });
//         })
//     }).catch(e => {
//         console.log(e);
//         res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating the order" });
//     })
// })

// Delete a order
router.delete("/:id", authorizePrivilege("DELETE_CUSTOMER_ORDER"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Order id" });
    }
    else {
        CustomerOrder.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the order" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Order deleted successfully!" });
            }
        })
    }
})
// Cancel a order
router.post("/assigned", authorizePrivilege("GET_CUSTOMER_ORDER_ASSIGNED"), (req, res) => {
    // if (!mongodb.ObjectId.isValid(req.params.id)) {
    //     res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Order id" });
    // }
    // else {
    //     CustomerOrder.find(req.params.id, { $set: { status: "Cancelled" } }, { new: true }, (err, doc) => {
    //         if (err) {
    //             return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while cancelling the order" })
    //         }
    //         if (doc) {
    //             res.json({ status: 200, data: doc, errors: false, message: "Order cancelled successfully!" });
    //         }
    //     })
    // }
})

// Canel a order
router.post("/cancel/:id", authorizePrivilege("CANCEL_CUSTOMER_ORDER"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Order id" });
    }
    else {
        CustomerOrder.findByIdAndUpdate(req.params.id, { $set: { status: "Cancelled" } }, { new: true }, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while cancelling the order" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Order cancelled successfully!" });
            }
        })
    }
})


// Update order
router.put("/:id", authorizePrivilege("UPDATE_CUSTOMER_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        console.log(req.body);
        let result = CustomerOrderController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, errors: false, data: null, message: result.errors });
        }
        CustomerOrder.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
            if (err)
                return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating order status" });
            if (doc) {
                doc.populate("placed_by placed_to").populate({
                    path: "products.product",
                    populate:{
                        path:"created_by category brand available_for", select:"-password"
                    }
                }).execPopulate()
                    .then(d => {
                        return res.status(200).json({ status: 200, errors: false, data: d, message: "Order updated successfully" });
                    })
                    .catch(e => {
                        return res.status(500).json({ status: 500, errors: true, data: d, message: "Order updated but error occured while populating" });
                    })
            } else {
                return res.status(200).json({ status: 200, errors: false, data: null, message: "No records updated" });
            }
        })
    } else {
        res.status(400).json({ status: 400, errors: false, data: null, message: "Invalid order id" });
    }
})

//GET specific order
router.get("/id/:id", authorizePrivilege("GET_CUSTOMER_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        CustomerOrder.findById(req.params.id)
            .populate("placed_by placed_to")
            .populate({
                path: "products.product",
                populate:{
                    path:"created_by category brand available_for", select:"-password"
                }
            })
            .exec()
            .then(doc => {
                if (doc)
                    res.json({ status: 200, data: doc, errors: false, message: "Order created successfully" });
                else
                    res.json({ status: 200, data: doc, errors: false, message: "No orders found" });
            }).catch(e => {
                res.status(500).json({ status: 500, errors: true, data: null, message: "Error while getting the order" });
            })
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid order id" });
    }
})

module.exports = router;