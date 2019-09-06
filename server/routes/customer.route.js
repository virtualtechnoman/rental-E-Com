const express = require('express');
const isEmpty = require("../utils/is-empty");
const CustomerController = require('../controllers/customer.controller');
const User = require('../models/user.model');
var mongodb = require("mongodb");
const moment = require('moment');
const router = express.Router();
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const uuid = require("uuid/v1");
const AWS = require("aws-sdk");
const S3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
});

const authorizePrivilege = require("../middleware/authorizationMiddleware");


// GET all Customers
router.get('/', authorizePrivilege("GET_ALL_CUSTOMERS"), async (req, res) => {
    try {
        const allUsers = await User.find({ role: process.env.CUSTOMER_ROLE }, "-password").populate({ path: "area", populate: { path: "city", populate: { path: "state" } } }).exec();
        // console.log(allUsers);
        res.json({ status: 200, message: "All customers", errors: false, data: allUsers });
    }
    catch (err) {
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching customers" });
    }
})
// GET all Customers address with no route
router.get('/addresswithnoroute', authorizePrivilege("GET_ALL_CUSTOMERS"), async (req, res) => {
    try {
        const allUsers = await User.find({ role: process.env.CUSTOMER_ROLE, route: { $exists: false } }, "street_address full_name city mobile_number email").populate({ path: "area", populate: { path: "city", populate: { path: "state" } } }).exec();
        // console.log(allUsers);
        res.json({ status: 200, message: "All customers", errors: false, data: allUsers });
    }
    catch (err) {
        res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching customers" });
    }
})
// GET all Customers address with given route
router.get('/byroute/:id', authorizePrivilege("GET_ALL_CUSTOMERS"), async (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        try {
            const allUsers = await User.find({ role: process.env.CUSTOMER_ROLE, route: req.params.id }, "full_name street_address city area").populate({ path: "area", populate: { path: "city", populate: { path: "state" } } }).exec();
            // console.log(allUsers);
            res.json({ status: 200, message: "All customers", errors: false, data: allUsers });
        }
        catch (err) {
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching customers" });
        }
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid route id" });
    }
})



// DELETE a user
router.delete('/:id', authorizePrivilege("DELETE_CUSTOMER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        User.findOne({ _id: req.params.id, role: process.env.CUSTOMER_ROLE }).exec().then(u => {
            if (u) {
                User.deleteOne({ _id: req.params.id }, (err, user) => {
                    if (err) throw err;
                    res.send({ status: 200, errors: false, message: "Customer deleted successfully", data: user })
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the customer" });
                });
            } else {
                res.json({ status: 200, errors: true, data: null, message: "No records found or User may not be a customer" });
            }
        }).catch(e => {
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the customer" });
        })
    } else {
        res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid user id" });
    }
});


router.put("/picture",authorizePrivilege("UPDATE_CUSTOMER"), upload.single('profile_picture'),(req,res)=>{
    if (req.file) {
        if (req.file.mimetype != 'image/jpeg' || req.file.mimetype != 'image/png') {
            let k = `profile-pictures/${req.user._id}/${uuid()}.${req.file.originalname.split('.').pop()}`;
            S3.upload({
                Bucket: 'binsar',
                Key: k,
                Body: req.file.buffer
            }, (err, data) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating profile picture" });
                } else {
                    User.findByIdAndUpdate(req.user._id, { $set: {profile_picture:k} }, { new: true }, (err, doc) => {
                        if (err) {
                            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating profile picture" });
                        }
                        else {
                            if (!doc)
                                return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Customer Found" });
                            else {
                                doc = doc.toObject();
                                delete doc.password;
                                res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Customer" });
                            }
                        }
                    }).populate({ path: "area", populate: { path: "city", populate: { path: "state" } } });
                }
            })
        }else{
            res.status(400).json({status:400,message:"No file selected",data:null,errors:true})
        }
    }
})
// UPDATE Profile 
router.put('/id/:id', authorizePrivilege("UPDATE_CUSTOMER"), (req, res) => {
    let result;
    if (mongodb.ObjectID.isValid(req.params.id)) {
        if (req.user.role._id === process.env.CUSTOMER_ROLE) { //Check if logged in user is customer or not
            result = CustomerController.verifyProfileUpdateSelf(req.body);
            if (!isEmpty(result.errors)) {
                return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
            }
        }
        else {
            result = CustomerController.verifyProfileUpdate(req.body);
            if (!isEmpty(result.errors)) {
                return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
            }
        }
        
            User.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
                if (err) {
                    return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating Customer data" });
                }
                else {
                    if (!doc)
                        return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Customer Found" });
                    else {
                        doc = doc.toObject();
                        delete doc.password;
                        console.log("Updated User", doc);
                        res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Customer" });
                    }
                }
            }).populate({ path: "area", populate: { path: "city", populate: { path: "state" } } });
    } else {
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid user id" });
    }
})

// ADD NEW CUSTOMER
router.post("/", authorizePrivilege("ADD_NEW_CUSTOMER"), (req, res) => {
    // let result = userCtrl.insert(req.body);
    // let user = (({ full_name, email, password, role }) => ({ full_name, email, password, role }))(req.body);
    let result = CustomerController.verifyCreateWeb(req.body)
    if (isEmpty(result.errors)) {
        User.findOne({ mobile_number: result.data.mobile_number }, (err, doc) => {
            if (err)
                return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while verifying the mobile" })
            if (doc) {
                return res.status(200).json({ status: 200, errors: true, data: null, message: "Mobile already registered" })
            }
        })
        result.data.user_id = "USR" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
        result.data.role = process.env.CUSTOMER_ROLE;
        // console.log(user);
        // bcrypt.genSalt(10, function (err, salt) {
        //     bcrypt.hash(result.data.password, salt, function (err, hash) {
        //         result.data.password = hash;
        const newuser = new User(result.data);
        newuser.save().then(data => {
            data = data.toObject();
            res.status(200).json({ status: 200, errors: false, data, message: "Customer Added successfully" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new customer" });
        })
        //     });
        // });
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" });
    }
})


module.exports = router;


function doUpload(req, res) {


}