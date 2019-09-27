const express = require('express');
const isEmpty = require("../utils/is-empty");
const userCtrl = require('../controllers/user.controller');
const User = require('../models/user.model');
var mongodb = require("mongodb");
const moment = require('moment');
const router = express.Router();
const bcrypt = require("bcryptjs");
const Ticket = require("../models/ticket.model");
const authorizePrivilege = require("../middleware/authorizationMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const uuid = require("uuid/v1");
const AWS = require("aws-sdk");
const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
});


//GET all users
router.get('/', authorizePrivilege("GET_ALL_USERS"), async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.user._id } }).populate("role route area").exec();
    // console.log(allUsers);
    res.json({ status: 200, message: "All users", errors: false, data: allUsers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
  }
})
//Get all hubs
router.get('/hub', authorizePrivilege("GET_ALL_USERS"), async (req, res) => {
  try {
    const allUsers = await User.find({ role: process.env.HUB_ROLE }).populate("role route area").exec();
    // console.log(allUsers);
    res.json({ status: 200, message: "All hubs", errors: false, data: allUsers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
  }
})
//Get all drivers
router.get('/driver', authorizePrivilege("GET_ALL_USERS"), async (req, res) => {
  try {
    const allUsers = await User.find({ role: process.env.DRIVER_ROLE }, "-password").populate("role route area").exec();
    // console.log(allUsers);
    res.json({ status: 200, message: "All Drivers", errors: false, data: allUsers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
  }
})
//Get all drivers
router.get('/customer', authorizePrivilege("GET_ALL_CUSTOMERS"), async (req, res) => {
  try {
    const allUsers = await User.find({ role: process.env.CUSTOMER_ROLE }, "-password").populate("role route area").exec();
    // console.log(allUsers);
    res.json({ status: 200, message: "All Customers", errors: false, data: allUsers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
  }
})

//Get all dboy
router.get('/dboy', authorizePrivilege("GET_ALL_USERS"), async (req, res) => {
  try {
    const allUsers = await User.find({ role: process.env.DELIVERY_BOY_ROLE }, "-password").populate("role route area").exec();
    // console.log(allUsers);
    res.json({ status: 200, message: "All Delivery Boys", errors: false, data: allUsers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
  }
})

//Get all farms
router.get('/farm', authorizePrivilege("GET_ALL_USERS"), async (req, res) => {
  try {
    const allUsers = await User.find({ role: process.env.FARM_ROLE }, "-password").populate("role route area").exec();
    // console.log(allUsers);
    res.json({ status: 200, message: "All Drivers", errors: false, data: allUsers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
  }
})


// //GET all users
router.get('/all', authorizePrivilege("GET_ALL_USERS"), async (req, res) => {
  try {
    const allUsers = await User.find().populate("role").exec();
    // console.log(allUsers);
    res.json({ status: 200, message: "All users", errors: false, data: allUsers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching users" });
  }
})

// GET all users by role
router.get('/role/:role', authorizePrivilege("GET_USER_BY_ROLE"), async (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.role)) {
    try {
      const allUsers = await User.find({ role: req.params.role }).populate("role route area").exec()
      if (allUsers.length > 0) {
        res.status(200).json({ status: 200, errors: false, data: allUsers, message: "All users" })
      } else {
        res.json({ status: 200, errors: false, data: allUsers, message: "No User Found" });
      }
    } catch (err) {
      console.log(err)
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while searching for users associated with this role" })
    }
  } else {
    res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid role id" });
  }
})
// GET all tickets by user
router.get('/ticket/:id', authorizePrivilege("GET_TICKETS_ALL"), (req, res) => {
  if (mongodb.ObjectId.isValid(req.params.id)) {
    Ticket.find({ customer: req.params.id }).populate([{ path: "created_by customer assignTo", select: "-password" }, { path: "responses.by", select: "-password" }]).exec().then(_tkts => {
      res.status(200).json({ status: 200, errors: false, data: _tkts, message: "All tickets for the given user" })
    }).catch(err => {
      console.log(err);
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while getting tickets" });
    })
  } else {
    res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid user id" });
  }
})

// DELETE a user
router.delete('/:id', authorizePrivilege("DELETE_USER"), (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    User.deleteOne({ _id: req.params.id }, (err, user) => {
      if (err) throw err;
      res.send({ status: 200, errors: false, message: "User deleted successfully", data: user })
    }).catch(err => {
      console.log(err);
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the user" });
    });
  } else {
    console.log("ID not Found")
    res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid user id" });
  }
});


// UPDATE A USER
router.put('/id/:id', authorizePrivilege("UPDATE_USER"), (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    // let user = (({ full_name, email, role }) => ({ full_name, email, role }))(req.body);
    const result = userCtrl.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
      return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
    }
    User.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating user data" });
      }
      else {
        doc.populate("role route area").execPopulate().then(d => {
          if (!d)
            return res.status(200).json({ status: 200, errors: true, data: doc, message: "No User Found" });
          else {
            d = d.toObject();
            delete d.password;
            console.log("Updated User", d);
            res.status(200).json({ status: 200, errors: false, data: d, message: "Updated User" });
          }
        }
        ).catch(e => {
          console.log(e);
          return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating user details" });
        });
      }
    })
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid user id" });
    // return res.status(404).send("ID NOT FOUND");
  }
})

// UPDATE USER OWN
router.put('/me', authorizePrivilege("UPDATE_USER_OWN"), (req, res) => {
  let result;
  if (req.user.role._id == process.env.DELIVERY_BOY_ROLE) {
    result = userCtrl.verifyDBoyProfileUpdateOwn(req.body)
  } else {
    result = userCtrl.verifyUpdate(req.body)
  }
  if (!isEmpty(result.errors)) {
    return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields required" })
  }
  User.findByIdAndUpdate(req.user._id, { $set: result.data }, { new: true }, (err, doc) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating user data" });
    }
    else {
      doc.populate("role route").execPopulate().then(d => {
        if (!d)
          return res.status(200).json({ status: 200, errors: true, data: doc, message: "No User Found" });
        else {
          d = d.toObject();
          delete d.password;
          console.log("Updated User", d);
          res.status(200).json({ status: 200, errors: false, data: d, message: "Updated User" });
        }
      }
      ).catch(e => {
        console.log(e);
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating user details" });
      });
    }
  })
})

// KYC USER OWN
router.put('/me/kyc', authorizePrivilege("UPDATE_USER_OWN"), upload.single("kyc"), (req, res) => {
  if (req.file) {
    if (req.file.mimetype != 'image/jpeg' || req.file.mimetype != 'image/png') {
      User.findById(req.user._id).exec().then(_user => {
        if (_user.kyc.verified) {
          return res.status(400).json({ status: 400, errors: true, data: null, message: "Your KYC is already verified" });
        } else {
          let k = `kyc/${req.user._id}/${uuid()}.${req.file.originalname.split('.').pop()}`;
          S3.upload({
            Bucket: 'binsar', Key: k, Body: req.file.buffer
          }, (err, data) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while uploading the file" });
            } else {
              _user.kyc.image = k;
              _user.save().then(doc => {
                doc = doc.toObject();
                delete doc.password;
                res.status(200).json({ status: 200, errors: false, data: doc, message: "Profile Updated Successfully" });
              }).catch(err => {
                console.log(err);
                return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating profile" });
              })
            }
          })
        }
      }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while getting profile details" });
      })
    } else {
      return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid file type" });
    }
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Please upload the image" });
  }
})
// ADD NEW USER
router.post("/", authorizePrivilege("ADD_NEW_USER"), (req, res) => {
  let result;
  if (req.body.role == process.env.DRIVER_ROLE)
    result = userCtrl.verifyAddDriver(req.body);
  else
    result = userCtrl.verifyCreate(req.body);
  if (isEmpty(result.errors)) {
    User.findOne({ email: result.data.email }, (err, doc) => {
      if (err)
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while verifying the email" });
      if (doc)
        return res.status(400).json({ status: 400, errors: true, data: null, message: "Email already registered" });
      result.data.user_id = "USR" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
      // console.log(user);
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(result.data.password, salt, function (err, hash) {
          result.data.password = hash;
          const newuser = new User(result.data);
          newuser.save().then(data => {
            data.populate("role route area").execPopulate().then(data => {
              data = data.toObject();
              delete data.password;
              res.status(200).json({ status: 200, errors: false, data, message: "User Added successfully" });
            })
          }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating new user" });
          })
        });
      });
    })
  }
  else {
    res.status(500).json({ status: 500, errors: result.errors, data: null, message: "Fields Required" });
  }
})


module.exports = router;
