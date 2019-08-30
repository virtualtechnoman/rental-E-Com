const express = require('express');
const isEmpty = require("../utils/is-empty");
const OrderController = require('../controllers/order.controller');
const Order = require('../models/order.model');
const ChallanController = require('../controllers/challan.controller');
const Challan = require('../models/challan.model');
var mongodb = require("mongodb");
const moment = require('moment');
const authorizePrivilege = require("../middleware/authorizationMiddleware");
const router = express.Router();

//GET all orders placed by self
router.get("/", authorizePrivilege("GET_ALL_ORDERS_OWN"), (req, res) => {
    Order.find({ placed_by: req.user._id }).populate([{ path: "placed_by placed_to", select: "-password" }, { path: "products.product", populate: { path: "category brand available_for" } }]).exec().then(doc => {
        return res.json({ status: 200, data: doc, errors: false, message: "All Orders" });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
    });
})

//GET all orders
router.get("/all", authorizePrivilege("GET_ALL_ORDERS"), (req, res) => {
    Order.find().populate([{ path: "placed_by placed_to remarks.acceptOrder.acceptedBy remarks.generateChallan.generatedBy remarks.recieveOrder.recievedBy remarks.billOrder.billedBy", select: "-password" }, { path: "products.product", populate: { path: "category brand available_for" } }]).exec().then(doc => {
        return res.json({ status: 200, data: doc, errors: false, message: "All Orders" });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
    });
})

// Create an order
router.post("/", authorizePrivilege("ADD_NEW_ORDER"), (req, res) => {
    let result = OrderController.verifyCreate(req.body);
    if (!isEmpty(result.errors))
        return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
    result.data.placed_by = req.user._id;
    result.data.status = "Pending";
    result.data.order_id = "ORD" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
    let newOrder = new Order(result.data);
    newOrder.save().then(order => {
        order.populate([{ path: "placed_by placed_to", select: "-password" }, { path: "products.product", populate: { path: "category brand available_for" } }]).execPopulate().then(doc => {
            res.json({ status: 200, data: doc, errors: false, message: "Order created successfully" });
        })
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating the order" });
    })
})

//Accept an order
router.put("/accept/:id", authorizePrivilege("ACCEPT_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Order.findById(req.params.id).exec().then(_ord => {
            if (_ord) {
                if (!_ord.accepted) {
                    let result = OrderController.verifyAccept(req.body);
                    if (!isEmpty(result.errors))
                        return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
                    let upd = {}, arrfilter = [];
                    result.data.products.forEach((ele, index) => {
                        upd["products.$[e" + index + "].accepted"] = ele.accepted;
                        let x = {};
                        x["e" + index + ".product"] = ele.product;
                        arrfilter.push(x);
                    })
                    if (result.data["remarks.acceptOrder"]) {
                        upd["remarks.acceptOrder"] = result.data["remarks.acceptOrder"];
                        upd["remarks.acceptOrder"].acceptedBy = req.user._id;
                        upd["remarks.acceptOrder"].at = Date.now();
                    } else
                        upd["remarks.acceptOrder"] = { acceptedBy: req.user._id , at:Date.now()};
                    upd.accepted = true;
                    upd.status = "Order Accepted";
                    Order.findByIdAndUpdate(req.params.id, { $set: upd }, { upsert: false, arrayFilters: arrfilter, new: true })
                        .populate([{ path: "placed_by placed_to remarks.acceptOrder.acceptedBy", select: "-password" }, { path: "products.product", populate: { path: "category brand available_for" } }]).lean().exec()
                        .then(d => {
                            res.json({ status: 200, data: d, errors: false, message: "Order accepted successfully" });
                        }).catch(e => {
                            console.log(e);
                            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating accepted values" });
                        })
                } else {
                    return res.status(400).json({ status: 400, errors: true, data: null, message: "Order already accepted" });
                }
            } else {
                return res.status(400).json({ status: 400, errors: true, data: null, message: "No order exist with the given id" });
            }
        })
    }
})
//Recieve an order
router.put("/recieve/:id", authorizePrivilege("RECIEVE_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Order.findById(req.params.id).exec().then(_ord => {
            if (_ord) {
                if (_ord.accepted) {
                    if (_ord.challan_generated) {
                        if (_ord.challan_accepted) {
                            if (!_ord.recieved) {
                                let result = OrderController.verifyRecieve(req.body);
                                if (!isEmpty(result.errors))
                                    return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
                                let upd = {}, arrfilter = [];
                                result.data.products.forEach((ele, index) => {
                                    upd["products.$[e" + index + "].recieved"] = ele.recieved;
                                    let x = {};
                                    x["e" + index + ".product"] = ele.product;
                                    arrfilter.push(x);
                                })
                                if (result.data["remarks.recieveOrder"]) {
                                    upd["remarks.recieveOrder"] = result.data["remarks.recieveOrder"];
                                    upd["remarks.recieveOrder"].recievedBy = req.user._id;
                                    upd["remarks.recieveOrder"].at = Date.now();
                                } else
                                    upd["remarks.recieveOrder"] = { recievedBy: req.user._id , at:Date.now()};
                                upd.recieved = true;
                                upd.status = "Recieved";
                                Order.findByIdAndUpdate(req.params.id, { $set: upd }, { upsert: false, arrayFilters: arrfilter, new: true })
                                    .populate([{ path: "placed_by placed_to remarks.acceptOrder.acceptedBy remarks.generateChallan.generatedBy remarks.recieveOrder.recievedBy", select: "-password" }, { path: "products.product", populate: { path: "category brand available_for" } }]).lean().exec().then(d => {
                                        res.json({ status: 200, data: d, errors: false, message: "Order recieved successfully" });
                                    }).catch(e => {
                                        console.log(e);
                                        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating recieved values" });
                                    })
                            } else {
                                return res.status(400).json({ status: 400, errors: true, data: null, message: "Order already recieved" });
                            }
                        } else {
                            return res.status(400).json({ status: 400, errors: true, data: null, message: "Accept the challan first" });
                        }
                    } else {
                        return res.status(400).json({ status: 400, errors: true, data: null, message: "Generate the order challan first" });
                    }
                } else {
                    return res.status(400).json({ status: 400, errors: true, data: null, message: "Accept the order first" });
                }
            } else {
                return res.status(400).json({ status: 400, errors: true, data: null, message: "Order not found" });
            }
        })
    } else {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid order id" });
    }
})
//Bill an order
router.put("/bill/:id", authorizePrivilege("BILL_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Order.findById(req.params.id).exec().then(_ord => {
            if (_ord) {
                if (_ord.accepted) {
                    if (_ord.challan_generated) {
                        if (_ord.challan_accepted) {
                            if (_ord.recieved) {
                                if (!_ord.billed) {
                                    let result = OrderController.verifyBill(req.body);
                                    if (!isEmpty(result.errors))
                                        return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
                                    let upd = {}, arrfilter = [];
                                    result.data.products.forEach((ele, index) => {
                                        upd["products.$[e" + index + "].billed"] = ele.billed;
                                        let x = {};
                                        x["e" + index + ".product"] = ele.product;
                                        arrfilter.push(x);
                                    })
                                    if (result.data["remarks.billOrder"]) {
                                        upd["remarks.billOrder"] = result.data["remarks.billOrder"];
                                        upd["remarks.billOrder"].billedBy = req.user._id;
                                        upd["remarks.billOrder"].at = Date.now();
                                    } else
                                        upd["remarks.billOrder"] = { billedBy: req.user._id, at:Date.now() };
                                    upd.billed = true;
                                    upd.status = "Billed";
                                    Order.findByIdAndUpdate(req.params.id, { $set: upd }, { upsert: false, arrayFilters: arrfilter, new: true })
                                        .populate([{ path: "placed_by placed_to remarks.acceptOrder.acceptedBy remarks.generateChallan.generatedBy remarks.recieveOrder.recievedBy remarks.billOrder.billedBy", select: "-password" }, { path: "products.product", populate: { path: "category brand available_for" } }]).lean().exec()
                                        .then(d => {
                                            res.json({ status: 200, data: d, errors: false, message: "Order billed successfully" });
                                        }).catch(e => {
                                            console.log(e);
                                            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating billed values" });
                                        })
                                } else {
                                    return res.status(400).json({ status: 400, errors: true, data: null, message: "Order already billed" });
                                }
                            } else {
                                return res.status(400).json({ status: 400, errors: true, data: null, message: "Recieve the order first" });
                            }
                        } else {
                            return res.status(400).json({ status: 400, errors: true, data: null, message: "Accept challan first" });
                        }
                    } else {
                        return res.status(400).json({ status: 400, errors: true, data: null, message: "Generate the order challan first" });
                    }
                } else {
                    return res.status(400).json({ status: 400, errors: true, data: null, message: "Accept the order first" });
                }
            } else {
                return res.status(400).json({ status: 400, errors: true, data: null, message: "Order not found" });
            }
        })
    } else {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid order id" });
    }
})

//Generate Challan for order
router.post("/gchallan/:oid", authorizePrivilege("GENERATE_ORDER_CHALLAN"), async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.oid)) {
        let result = ChallanController.verifyCreateFromOrder(req.body);
        if (!isEmpty(result.errors))
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
        Order.findById(req.params.oid).lean().exec().then(_ord => {
            if (_ord) {
                if (_ord.accepted) {
                    if (_ord.challan_generated) {
                        return res.status(400).json({ status: 400, errors: true, data: null, message: "Challan already generated for this order" });
                    } else {
                        let upd = {}, arrfilter = [];
                        result.data.products.forEach((ele, index) => {
                            upd["products.$[e" + index + "].dispatched"] = ele.dispatched;
                            let x = {};
                            x["e" + index + ".product"] = ele.product;
                            arrfilter.push(x);
                        })
                        if (result.data["remarks.generateChallan"]) {
                            upd["remarks.generateChallan"] = result.data["remarks.generateChallan"];
                            upd["remarks.generateChallan"].generatedBy = req.user._id;
                            upd["remarks.generateChallan"].at = Date.now();
                        } else
                            upd["remarks.generateChallan"] = { generatedBy: req.user._id , at:Date.now()};
                        upd.challan_generated = true;
                        upd.status = "Challan Generated";
                        Order.findByIdAndUpdate(_ord._id, { $set: upd }, { upsert: false, arrayFilters: arrfilter, new: true })
                            .lean().exec().then(d => {
                                delete result.data.products;
                                result.data.processing_unit_incharge = req.user._id;
                                result.data.order = _ord._id;
                                result.data.order_type = "order";
                                result.data.challan_id = "CHLN" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
                                let newChallan = new Challan(result.data);
                                newChallan.save()
                                    .then(challan => {
                                        challan.populate([{ path: "processing_unit_incharge dispatch_processing_unit vehicle driver", select: "-password" }, { path: "order", model: "order", populate: { path: "products.product placed_by placed_to remarks.acceptOrder.acceptedBy remarks.generateChallan.generatedBy", select: "-password", populate: { path: "brand category available_for" } } }])
                                            .execPopulate()
                                            .then(doc => {
                                                res.json({ status: 200, data: doc, errors: false, message: "Challan generated successfully" });
                                            })
                                    }).catch(e => {
                                        console.log(e);
                                        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while generating the challan" });
                                    })
                            }).catch(e => {
                                console.log(e);
                                res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating accepted values" });
                            })
                    }
                } else {
                    return res.status(400).json({ status: 400, errors: true, data: null, message: "Accept the order first" })
                }
            } else {
                return res.status(400).json({ status: 400, errors: true, data: null, message: "Order not found" });
            }
        })
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid order id" });
    }
})

// Delete a order
router.delete("/:id", authorizePrivilege("DELETE_ORDER"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Order id" });
    }
    else {
        Order.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the order" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Order deleted successfully!" });
            }
        })
    }
})

// Update order status
// router.put("/setstatus/:id", authorizePrivilege("UPDATE_ORDER"), (req, res) => {
//     if (mongodb.ObjectID.isValid(req.params.id)) {
//         console.log(req.body);
//         let result = OrderController.verifyUpdateStatus(req.body);
//         if (!isEmpty(result.errors)) {
//             return res.status(400).json({ status: 400, errors: false, data: null, message: result.errors });
//         }
//         Order.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
//             if (err)
//                 return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating order status" });
//             if (doc) {
//                 doc.populate("placed_by products.product status placed_to", "-password")
//                     .execPopulate()
//                     .then(d => {
//                         return res.status(200).json({ status: 200, errors: false, data: d, message: "Order updated successfully" });
//                     })
//                     .catch(e => {
//                         return res.status(500).json({ status: 500, errors: true, data: null, message: "Order updated but error occured while populating" });
//                     })
//             } else {
//                 return res.status(200).json({ status: 200, errors: false, data: null, message: "No records updated" });
//             }
//         })
//     } else {
//         res.status(400).json({ status: 400, errors: false, data: null, message: "Invalid order id" });
//     }
// })

//GET specific order
router.get("/id/:id", authorizePrivilege("GET_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Order.findById(req.params.id)
            .populate("placed_by products.product placed_to")
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