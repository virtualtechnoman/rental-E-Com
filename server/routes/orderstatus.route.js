const express = require('express');
const OrderStatus = require('../models/orderstatus.model');
const mongodb = require("mongodb");
const authorizePrivilege = require("../middleware/authorizationMiddleware");
const router = express.Router();

//GET all status
// router.get("/", authorizePrivilege("GET_ALL_ORDERSTATUS"), (req, res) => {
//     OrderStatus.find().exec().then(status=>{
//         res.json({status: 200, data: status, errors: false, message: "All Statuses"});
//     })
// })

//GET all status after specific status
router.get("/after/:id", authorizePrivilege("GET_ALL_ORDERSTATUS"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        OrderStatus.findById(req.params.id).exec().then(_stat=>{
            OrderStatus.find({value:{$gt:_stat.value}},"-value").sort({value:"asc"}).exec().then(_status=>{
                res.json({ status: 200, data: _status, errors: false, message: "All Statuses greated than "+_stat.name });
            })
        })
    }else{
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid order status id" });
    }
})

// Generate all statuses
router.post("/genall", authorizePrivilege("GENERATE_ALL_ORDERSTATUS"), (req, res) => {
    let orderStatuses = ["Pending","Accepted","Dispatch","Recieved","Billed"];
    let pr = [];
    orderStatuses.forEach((element,index)=>{
        pr.push(OrderStatus.findOneAndUpdate({name:element},{value:index},{upsert:true}));
    })
    Promise.all(pr).then(doc=>{
        res.json({ status: 200, data:null, errors: false, message: "All Statuses generated successfully" });
    })
})
module.exports = router;