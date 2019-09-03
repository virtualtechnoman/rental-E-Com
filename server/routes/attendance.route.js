const Attendance = require("../models/area.model");
const AttendanceController = require("../controllers/area.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get all attendance
router.get("/", authorizePrivilege("GET_ALL_ATTENDANCE"), (req, res) => {
    Attendance.find().populate("user","-password").exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All attendance" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No area found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting areas" })
    })
})

//Add new attendance
router.post('/', authorizePrivilege("ADD_NEW_ATTENDANCE"), async (req, res) => {
    let result = AttendanceController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    Attendance.findOneAndUpdate({user:result.user},{$push:{dates:result.date}},{new:true, upsert:true}).populate("user","-password").exec()
    .then(_attendance=>{
            res.json({ status: 200, data: _attendance, errors: false, message: "Attendance added successfully" })
        }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding attendance" })
    });
});

//Update a city
// router.put("/:id", authorizePrivilege("UPDATE_AREA"), (req, res) => {
//     if (mongodb.ObjectId.isValid(req.params.id)) {
//         let result = AttendanceController.verifyUpdate(req.body);
//         if (!isEmpty(result.errors)) {
//             return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
//         }
//         Attendance.findByIdAndUpdate(req.params.id, result.data, { new: true }).populate("hub","-password").populate({path:"city",populate:{path:"state"}}).exec()
//             .then(area=>{
//                     res.status(200).json({ status: 200, data: area, errors: false, message: "Attendance Updated Successfully" });
//             }).catch(err => {
//                 console.log(err);
//                 res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating area" })
//             })
//     }
//     else {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid area id" });
//     }
// })

//DELETE A attendance
router.delete("/:id", authorizePrivilege("DELETE_ATTENDANCE"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid attendance id" });
    }
    else {
        Attendance.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the attendance" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Attendance deleted successfully!" });
            }
        })
    }
})

module.exports = router;