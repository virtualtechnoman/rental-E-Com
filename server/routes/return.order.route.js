const router = require("express").Router();
const isEmpty = require("../utils/is-empty");
const ReturnOrderController = require('../controllers/return.order.controller');
const ReturnOrder = require("../models/return.order.model");
const ChallanController = require('../controllers/challan.controller');
const Challan = require('../models/challan.model');
var mongodb = require("mongodb");
const moment = require('moment');
const authorizePrivilege = require("../middleware/authorizationMiddleware");

//GET specific return order
router.get("/id/:id", authorizePrivilege("GET_RETURN_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        ReturnOrder.findById(req.params.id).populate([{path:"placed_by placed_to",select:"-password"},{path:"products.product",populate:{path:"category brand"}}]).exec().then(doc => {
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

//GET Return orders placed by self
router.get("/", authorizePrivilege("GET_ALL_RETURN_ORDERS_OWN"), (req, res) => {
    ReturnOrder.find({ placed_by: req.user._id }).populate([{path:"placed_by placed_to",select:"-password"},{path:"products.product",populate:{path:"category brand"}}]).exec().then(doc => {
        return res.json({ status: 200, data: doc, errors: false, message: "All Return Orders" });
    }).catch(err => {
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
    });
})

//GET Return orders
router.get("/all", authorizePrivilege("GET_ALL_RETURN_ORDERS"), (req, res) => {
    ReturnOrder.find().populate([{path:"placed_by placed_to",select:"-password"},{path:"products.product",populate:{path:"category brand"}}]).exec().then(doc => {
        return res.json({ status: 200, data: doc, errors: false, message: "All Return Orders" });
    }).catch(err => {
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
    });
})

//Create Return Order
router.post("/", authorizePrivilege("ADD_NEW_RETURN_ORDER"), (req, res) => {
    let result = ReturnOrderController.verifyCreate(req.body);
    if (!isEmpty(result.errors))
        return res.json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
    result.data.placed_by = req.user._id;
    result.data.status = "Pending";
    result.data.order_id = "RORD" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
    let newOrder = new ReturnOrder(result.data);
    newOrder.save().then(order => {
        order.populate([{path:"placed_by placed_to",select:"-password"},{path:"products.product",populate:{path:"category brand"}}]).execPopulate().then(doc => {
            res.json({ status: 200, data: doc, errors: false, message: "Return Order created successfully" });
        })
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating the order" });
    })
})

//Accept an return order
// router.put("/accept/:id", authorizePrivilege("ACCEPT_RETURN_ORDER"), (req, res) => {
//     if (mongodb.ObjectID.isValid(req.params.id)) {
//         ReturnOrder.findById(req.params.id).exec().then(_ord => {
//             if (_ord) {
//                 if (!_ord.accepted) {
//                     let result = ReturnOrderController.verifyAccept(req.body);
//                     if (!isEmpty(result.errors))
//                         return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
//                     let upd = {}, arrfilter = [];
//                     result.data.products.forEach((ele, index) => {
//                         upd["products.$[e" + index + "].accepted"] = ele.accepted;
//                         let x = {};
//                         x["e" + index + ".product"] = ele.product;
//                         arrfilter.push(x);
//                     })
//                     upd.accepted = true;
//                     upd.status="Order Accepted";
//                     ReturnOrder.findByIdAndUpdate(req.params.id, { $set: upd }, { upsert: false, arrayFilters: arrfilter, new: true })
//                         .populate("products.product placed_by placed_to", "-password").lean().exec()
//                         .then(d => {
//                             res.json({ status: 200, data: d, errors: false, message: "Return Order accepted successfully" });
//                         }).catch(e => {
//                             console.log(e);
//                             res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating accepted values" });
//                         })
//                 } else {
//                     return res.status(400).json({ status: 400, errors: true, data: null, message: "Order already accepted" });
//                 }
//             } else {
//                 return res.status(400).json({ status: 400, errors: true, data: null, message: "No order exist with the given id" });
//             }
//         })
//     }
// })

//Recieve a return order
router.put("/recieve/:id", authorizePrivilege("RECIEVE_RETURN_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        ReturnOrder.findById(req.params.id).exec().then(_ord => {
            if (_ord) {
                if (_ord.challan_generated) {
                    if (_ord.challan_accepted) {
                        if (!_ord.recieved) {
                            let result = ReturnOrderController.verifyRecieve(req.body);
                            if (!isEmpty(result.errors))
                                return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
                            let upd = {}, arrfilter = [];
                            result.data.products.forEach((ele, index) => {
                                upd["products.$[e" + index + "].recieved"] = ele.recieved;
                                let x = {};
                                x["e" + index + ".product"] = ele.product;
                                arrfilter.push(x);
                            })
                            upd.recieved = true;
                            upd.status = "Recieved";
                            ReturnOrder.findByIdAndUpdate(req.params.id, { $set: upd }, { upsert: false, arrayFilters: arrfilter, new: true })
                                .populate([{path:"placed_by placed_to",select:"-password"},{path:"products.product",populate:{path:"category brand"}}]).lean().exec().then(d => {
                                    res.json({ status: 200, data: d, errors: false, message: "Return Order recieved successfully" });
                                }).catch(e => {
                                    console.log(e);
                                    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating recieved values" });
                                })
                        } else {
                            return res.status(400).json({ status: 400, errors: true, data: null, message: "Return Order already recieved" });
                        }
                    } else {
                        return res.status(400).json({ status: 400, errors: true, data: null, message: "Accept the challan first" });
                    }
                } else {
                    return res.status(400).json({ status: 400, errors: true, data: null, message: "Generate the return order challan first" });
                }
            } else {
                return res.status(400).json({ status: 400, errors: true, data: null, message: "Return Order not found" });
            }
        })
    } else {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid return order id" });
    }
})

//Bill return order
router.put("/bill/:id", authorizePrivilege("BILL_RETURN_ORDER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        ReturnOrder.findById(req.params.id).exec().then(_ord => {
            if (_ord) {
                if (_ord.challan_generated) {
                    if (_ord.challan_accepted) {
                        if (_ord.recieved) {
                            if (!_ord.billed) {
                                let result = ReturnOrderController.verifyBill(req.body);
                                if (!isEmpty(result.errors))
                                    return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
                                let upd = {}, arrfilter = [];
                                result.data.products.forEach((ele, index) => {
                                    upd["products.$[e" + index + "].billed"] = ele.billed;
                                    let x = {};
                                    x["e" + index + ".product"] = ele.product;
                                    arrfilter.push(x);
                                })
                                upd.billed = true;
                                upd.status = "Billed";
                                ReturnOrder.findByIdAndUpdate(req.params.id, { $set: upd }, { upsert: false, arrayFilters: arrfilter, new: true })
                                    .populate([{path:"placed_by placed_to",select:"-password"},{path:"products.product",populate:{path:"category brand"}}]).lean().exec()
                                    .then(d => {
                                        res.json({ status: 200, data: d, errors: false, message: "Return Order billed successfully" });
                                    }).catch(e => {
                                        console.log(e);
                                        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating billed values" });
                                    })
                            } else {
                                return res.status(400).json({ status: 400, errors: true, data: null, message: "Return Order already billed" });
                            }
                        } else {
                            return res.status(400).json({ status: 400, errors: true, data: null, message: "Recieve the order first" });
                        }
                    } else {
                        return res.status(400).json({ status: 400, errors: true, data: null, message: "Accept challan first" });
                    }
                } else {
                    return res.status(400).json({ status: 400, errors: true, data: null, message: "Generate the return order challan first" });
                }
            } else {
                return res.status(400).json({ status: 400, errors: true, data: null, message: "Return order not found" });
            }
        })
    } else {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid return order id" });
    }
})

//Generate Challan for order
router.post("/gchallan/:oid", authorizePrivilege("GENERATE_RETURN_ORDER_CHALLAN"), async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.oid)) {
        let result = ChallanController.verifyCreateFromReturnOrder(req.body);
        if (!isEmpty(result.errors))
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
        ReturnOrder.findById(req.params.oid).exec().then(_rord => {
            if (_rord.challan_generated) {
                return res.status(400).json({ status: 400, errors: true, data: null, message: "Challan already generated for this return order" });
            } else {
                result.data.processing_unit_incharge = req.user._id;
                result.data.order = req.params.oid;
                result.data.order_type = "rorder";
                result.data.challan_id = "CHLN" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
                let newChallan = new Challan(result.data);
                newChallan.save()
                    .then(challan => {
                        challan.populate([{ path: "processing_unit_incharge vehicle driver", select: "-password" }])
                            .execPopulate().then(doc => {
                                ReturnOrder.findByIdAndUpdate(_rord._id, { $set: { challan_generated: true, status:"Challan Generated" } }, { new: true }).populate([{path:"placed_by placed_to",select:"-password"},{path:"products.product",populate:{path:"category brand"}}]).then(_d => {
                                    doc = doc.toObject();
                                    doc.order = _d.toObject();
                                    res.json({ status: 200, data: doc, errors: false, message: "Challan generated successfully" });
                                }).catch(e => {
                                    console.log(e);
                                    return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating the return order" });
                                })
                            }).catch(e => {
                                console.log(e);
                                return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while populating the challan" });
                            })
                    }).catch(e => {
                        console.log(e);
                        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while generating the challan" });
                    })
            }
        })
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid order id" });
    }
})

// Delete a return order
router.delete("/:id", authorizePrivilege("DELETE_RETURN_ORDER"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid return order id" });
    }
    else {
        ReturnOrder.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the return order" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Return order deleted successfully!" });
            }
        })
    }
})

// Update order
// router.put("/:id", authorizePrivilege("UPDATE_RETURN_ORDER"), (req, res) => {
//     if (mongodb.ObjectID.isValid(req.params.id)) {
//         console.log(req.body);
//         let result = ReturnOrderController.verifyUpdate(req.body);
//         if (!isEmpty(result.errors)) {
//             return res.status(400).json({ status: 400, errors: false, data: null, message: result.errors });
//         }
//         ReturnOrder.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
//             if (err)
//                 return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating order status" });
//             if (doc) {
//                 doc.populate("placed_by placed_to").populate({ path: "order", model: "rorder", populate: { path: "products.product" } })
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

module.exports = router;