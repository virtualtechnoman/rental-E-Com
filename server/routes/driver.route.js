const express = require('express');
const isEmpty = require("../utils/is-empty");
const DriverController = require('../controllers/driver.controller');
const Driver = require('../models/driver.model');
var mongodb = require("mongodb");
const router = express.Router();
const authorizePrivilege = require("../middleware/authorizationMiddleware");

//GET all drivers
router.get('/', authorizePrivilege("GET_ALL_DRIVERS"), async (req, res) => {
  try {
    const allDrivers = await Driver.find().exec();
    // console.log(allDrivers);
    res.json({ status: 200, message: "All drivers", errors: false, data: allDrivers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching drivers" });
  }
})

//GET all available drivers
router.get('/available', authorizePrivilege("GET_ALL_DRIVERS"), async (req, res) => {
  try {
    const allDrivers = await Driver.find({ isAvailable: true }).exec();
    // console.log(allDrivers);
    res.json({ status: 200, message: "All available drivers", errors: false, data: allDrivers });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching drivers" });
  }
})

// GET all vehicles by type
// router.get('/type/:type',/*authorizePrivilege("GET_USER_BY_ROLE"),*/ async (req, res) => {
//   // console.log(req.body.role)
//   if (mongodb.ObjectId.isValid(req.params.type)) {
//     try {
//       const allUsers = await User.find({ role: req.params.role }).populate("role").exec()
//       if (allUsers.length > 0) {
//         res.status(200).json({ status: 200, errors: false, data: allUsers, message: "All users" })
//       } else {
//         res.json({ status: 200, errors: false, data: allUsers, message: "No User Found" });
//       }
//     } catch (err) {
//       console.log(err)
//       res.status(500).json({ status: 500, errors: true, data: null, message: "Error while searching for users associated with this role" })
//     }
//   } else {
//     res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid role id" });
//   }
// })

// DELETE a Driver
router.delete('/:id', authorizePrivilege("DELETE_DRIVER"), (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    Driver.deleteOne({ _id: req.params.id }, (err, vehicle) => {
      if (err) throw err;
      res.send({ status: 200, errors: false, message: "Driver deleted successfully", data: vehicle })
    }).catch(err => {
      console.log(err);
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the driver" });
    });
  } else {
    // console.log("ID not Found")
    res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid driver id" });
  }
});


// UPDATE A Driver
router.put('/:id', authorizePrivilege("UPDATE_DRIVER"), (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    // let user = (({ full_name, email, role }) => ({ full_name, email, role }))(req.body);
    const result = DriverController.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
      return res.json(res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields Required" }))
    }
    Driver.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating vehicle data" });
      }
      if (!doc)
        return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Driver Found" });
      else {
        console.log("Updated Driver", doc);
        res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Driver" });
      }
    })
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid Driver Id" });
  }
})

// ADD NEW DRIVER
router.post("/", authorizePrivilege("ADD_NEW_DRIVER"), (req, res) => {
  let result = DriverController.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    const newDriver = new Driver(result.data);
    newDriver.save().then(data => {
      res.status(200).json({ status: 200, errors: false, data, message: "Driver Added successfully" });
    }).catch(err => {
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while adding new driver" });
    })
  }
  else {
    res.json({ status: 500, errors: result.errors, data: null, message: "Error while adding driver" });
  }
})

module.exports = router;