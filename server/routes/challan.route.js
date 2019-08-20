const express = require('express');
const isEmpty = require("../utils/is-empty");
const ChallanController = require('../controllers/challan.controller');
const Challan = require('../models/challan.model');
var mongodb = require("mongodb");
const moment = require('moment');
const router = express.Router();
const authorizePrivilege = require("../middleware/authorizationMiddleware");

//GET all challans created by self
router.get("/", authorizePrivilege("GET_ALL_CHALLAN_OWN"), (req, res) => {
    // console.log(req.user);
    Challan.find({ processing_unit_incharge: req.user._id }).populate("processing_unit_incharge products.product vehicle driver").exec().then(doc => {
        if (doc.length > 0)
            return res.json({ status: 200, data: doc, errors: false, message: "All Challans" });
        else
            return res.json({ status: 200, data: doc, errors: true, message: "No Challan found" });
    }).catch(err => {
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting Challans" })
    });
})

//GET all challans
router.get("/all", authorizePrivilege("GET_ALL_CHALLAN"), (req, res) => {
    // console.log(req.user);
    Challan.find()
        .populate("processing_unit_incharge products.product dispatch_processing_unit vehicle driver")
        .exec()
        .then(doc => {
            if (doc.length > 0)
                return res.json({ status: 200, data: doc, errors: false, message: "All Challans" });
            else
                return res.json({ status: 200, data: doc, errors: true, message: "No Challan found" });
        }).catch(err => {
            return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting Challans" })
        });
})

//GET orders for pagination
//filters ====>
// router.get("/page/:page",(req,res)=>{

// })
// Create Challan
// router.post("/", authorizePrivilege("ADD_NEW_CHALLAN"), async (req, res) => {
//     let result = ChallanController.verifyCreate(req.body);
//     if (!isEmpty(result.errors))
//         return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
//     result.data.processing_unit_incharge = req.user._id;
//     result.data.challan_id = "CHLN" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
//     let newChallan = new Challan(result.data);
//     newChallan.save()
//         .then(challan => {
//             Challan.findById(challan._id)
//                 .populate("processing_unit_incharge products.product vehicle driver")
//                 .exec()
//                 .then(doc => {
//                     res.json({ status: 200, data: doc, errors: false, message: "Challan created successfully" });
//                 })
//         }).catch(e => {
//             console.log(e);
//             res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating the order" });
//         })
// })

//Update order status
// router.put("/:id",(req,res)=>{
//     if(mongodb.ObjectID.isValid(req.params.id)){
//         let result = OrderController.verifyUpdate(req.body);
//         if(!isEmpty(result.errors)){
//             return res.status(400).json({status:400,errors:false,data:null,message:"Fields required"});
//         }
//         Order.findByIdAndUpdate(req.params.id,result.data,{new:true},(err,doc)=>{
//             if(err)
//             return res.status(500).json({status:500,errors:true,data:null,message:"Error while updating order status"});
//             if(doc){
//                 return res.status(200).json({status:200,errors:false,data:doc,message:"Order status updated successfully"});
//             }else{
//                 return res.status(200).json({status:200,errors:false,data:null,message:"No records updated"});
//             }
//         })
//     }else{
//         res.status(400).json({status:400,errors:false,data:null,message:"Invalid order id"});
//     }
// })

// Delete challan
router.delete("/:id", authorizePrivilege("DELETE_CHALLAN"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Challan.deleteOne({ _id: req.params.id }, (err, challan) => {
            if (err) throw err;
            res.send({ status: 200, errors: false, message: "Challan deleted successfully", data: challan })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the challan" });
        });
    } else {
        res.status(400).json({ status: 400, errors: false, data: null, message: "Invalid challan id" });
    }
})

//GET specific challan
router.get("/id/:id", authorizePrivilege("GET_CHALLAN"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Challan.findById(req.params.id).populate("processing_unit_incharge products.product vehicle driver").exec().then(doc => {
            if (doc)
                res.json({ status: 200, data: doc, errors: false, message: "Challan" });
            else
                res.json({ status: 200, data: doc, errors: true, message: "No challan found" });
        }).catch(e => {
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while getting the challan" });
        })
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid challan id" });
    }
})


module.exports = router;