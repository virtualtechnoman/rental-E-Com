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
router.get("/id/:id",authorizePrivilege("GET_RETURN_ORDER"),(req,res)=>{
    if(mongodb.ObjectID.isValid(req.params.id)){
        ReturnOrder.findById(req.params.id).populate("placed_by products.product").exec().then(doc=>{
            if(doc)
            res.json({status:200,data:doc,errors:false,message:"Order created successfully"});
            else
            res.json({status:200,data:doc,errors:false,message:"No orders found"});
        }).catch(e=>{
            res.status(500).json({status:500,errors:true,data:null,message:"Error while getting the order"});
        })
    }else{
        res.status(400).json({status:400,errors:true,data:null,message:"Invalid order id"});
    }
})

//GET Return orders placed by self
router.get("/",authorizePrivilege("GET_ALL_RETURN_ORDERS_OWN"),(req,res)=>{
    ReturnOrder.find({placed_by:req.user._id}).populate("placed_by placed_to products.product").exec().then(doc=>{
        return res.json({status:200,data:doc,errors:false,message:"All Return Orders"});
    }).catch(err=>{
        return res.status(500).json({status:500,data:null,errors:true,message:"Error while getting orders"})
    });
})

//GET Return orders
router.get("/all",authorizePrivilege("GET_ALL_RETURN_ORDERS"),(req,res)=>{
    ReturnOrder.find().populate("placed_by products.product").exec().then(doc=>{
        return res.json({status:200,data:doc,errors:false,message:"All Return Orders"});
    }).catch(err=>{
        return res.status(500).json({status:500,data:null,errors:true,message:"Error while getting orders"})
    });
})

//Create Return Order
router.post("/",authorizePrivilege("ADD_NEW_RETURN_ORDER"),(req,res)=>{
    let result = ReturnOrderController.verifyCreate(req.body);
    if(!isEmpty(result.errors))
    return res.json({status:400,errors:result.errors,data:null,message:"Fields required"});
    result.data.placed_by = req.user._id;
    result.data.order_id = "RORD" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
    let newOrder = new ReturnOrder(result.data);
    newOrder.save().then(order=>{
        ReturnOrder.findById(order._id).populate("placed_by products.product").exec().then(doc=>{
            res.json({status:200,data:doc,errors:false,message:"Order created successfully"});
        })
    }).catch(e=>{
        console.log(e);
        res.status(500).json({status:500,errors:true,data:null,message:"Error while creating the order"});
    })
})

//Generate Challan for order
router.post("/gchallan/:oid", authorizePrivilege("ADD_NEW_CHALLAN"), async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.oid)) {
        let result = ChallanController.verifyCreate(req.body);
        if (!isEmpty(result.errors))
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
        result.data.processing_unit_incharge = req.user._id;
        result.data.order = request.params.oid;
        result.data.order_type = "return order";
        result.data.challan_id = "CHLN" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
        let newChallan = new Challan(result.data);
        newChallan.save()
            .then(challan => {
                Challan.findById(challan._id)
                    .populate("processing_unit_incharge products.product vehicle driver")
                    .exec()
                    .then(doc => {
                        res.json({ status: 200, data: doc, errors: false, message: "Challan created successfully" });
                    })
            }).catch(e => {
                console.log(e);
                res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating the order" });
            })
    }else{
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid order id" });
    }
})

// Delete a return order
router.delete("/:id",authorizePrivilege("DELETE_RETURN_ORDER"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({status:400,data:null,errors:true, message: "Invalid return order id" });
    }
    else {
        ReturnOrder.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status:500,data:null,errors:true,message: "Error while deleting the return order" })
            }
            if (doc) {
                res.json({ status:200,data:doc,errors:false,message: "Return order deleted successfully!" });
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
//                 doc.populate("placed_by products.product placed_to")
//                     .execPopulate()
//                     .then(d => {
//                         return res.status(200).json({ status: 200, errors: false, data: d, message: "Order updated successfully" });
//                     })
//                     .catch(e => {
//                         return res.status(500).json({ status: 500, errors: true, data: d, message: "Order updated but error occured while populating" });
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