const express = require('express');
const isEmpty = require("../utils/is-empty");
const VehicleController = require('../controllers/vehicle.controller');
const Vehicle = require('../models/vehicle.model');
var mongodb = require("mongodb");
const router = express.Router();
const authorizePrivilege = require("../middleware/authorizationMiddleware");
//GET all vehicle
router.get('/',authorizePrivilege("GET_ALL_VEHICLES"), async (req, res) => {
  try {
    const allVehicles = await Vehicle.find().exec();
    // console.log(allVehicles);
    res.json({ status: 200, message: "All vehicles", errors: false, data: allVehicles });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching vehicles" });
  }
})

//GET all available vehicle
router.get('/available',authorizePrivilege("GET_ALL_VEHICLES"),async (req, res) => {
  try {
    const allVehicles = await Vehicle.find({ isAvailable: true }).exec();
    // console.log(allVehicles);
    res.json({ status: 200, message: "All available vehicles", errors: false, data: allVehicles });
  }
  catch (err) {
    res.status(500).json({ status: 500, errors: true, data: null, message: "Error while fetching vehicles" });
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

// DELETE a vehicle
router.delete('/:id',authorizePrivilege("DELETE_VEHICLE"),(req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    Vehicle.deleteOne({ _id: req.params.id }, (err, vehicle) => {
      if (err) throw err;
      res.send({ status: 200, errors: false, message: "Vehicle deleted successfully", data: vehicle })
    }).catch(err => {
      console.log(err);
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while deleting the vehicle" });
    });
  } else {
    console.log("ID not Found")
    res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid vehicle id" });
  }
});


// UPDATE A Vehicle
router.put('/:id',authorizePrivilege("UPDATE_VEHICLE"),(req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    // let user = (({ full_name, email, role }) => ({ full_name, email, role }))(req.body);
    const result = VehicleController.verifyUpdate(req.body);
    if (!isEmpty(result.errors)) {
      return res.json(result.errors)
    }
    Vehicle.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
      if (err) {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while updating vehicle data" });
      }
      if (!doc)
        return res.status(200).json({ status: 200, errors: true, data: doc, message: "No Vehicle Found" });
      else {
        console.log("Updated Vehicle", doc);
        res.status(200).json({ status: 200, errors: false, data: doc, message: "Updated Vehicle" });
      }
    })
  } else {
    return res.status(400).json({ status: 400, errors: true, data: null, message: "Invalid Vehicle Id" });
  }
})

// ADD NEW VEHICLE
router.post("/", authorizePrivilege("ADD_NEW_VEHICLE"),(req, res) => {
  let result = VehicleController.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    const newVehicle = new Vehicle(result.data);
    newVehicle.save().then(data => {
      res.status(200).json({ status: 200, errors: false, data, message: "Vehicle Added successfully" });
    }).catch(err => {
      res.status(500).json({ status: 500, errors: true, data: null, message: "Error while adding new vehicle" });
    })
  }
  else {
    res.json({ status: 500, errors: true, data: result.errors, message: "Error while adding vehicle" });
  }
})


module.exports = router;
