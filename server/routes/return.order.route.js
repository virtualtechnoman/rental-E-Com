const router = require("express").Router();
const isEmpty = require("../utils/is-empty");
const ReturnOrderController = require('../controllers/return.order.controller');
const ReturnOrder = require("../models/return.order.model");
var mongodb = require("mongodb");
const moment = require('moment');

//GET specific return order
router.get("/:id",(req,res)=>{
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

//GET Return orders
router.get("/",(req,res)=>{
    ReturnOrder.find().populate("placed_by products.product").exec().then(doc=>{
        return res.json({status:200,data:doc,errors:false,message:"All Return Orders"});
    }).catch(err=>{
        return res.status(500).json({status:500,data:null,errors:true,message:"Error while getting orders"})
    });
})

//Create Return Order
router.post("/",(req,res)=>{
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

module.exports = router;