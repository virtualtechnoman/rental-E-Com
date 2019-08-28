const FVisit = require("../models/farm.visit.model");
const FVisitController = require("../controllers/farm.visit.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get all visits own
router.get("/", authorizePrivilege("GET_FARM_VISITS_OWN"), (req, res) => {
    FVisit.find({user:req.user._id}).exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All visits" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No visits found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting areas" })
    })
})

// Get all visits
router.get("/all", authorizePrivilege("GET_ALL_FARM_VISITS"), (req, res) => {
    FVisit.find().exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All visits" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No visits found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting areas" })
    })
})

//Add new visit
router.post('/', authorizePrivilege("ADD_NEW_FARM_VISIT"), async (req, res) => {
    let result = FVisitController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newVisit = new FVisit(result.data);
    newVisit.save().then(visit => {
            res.json({ status: 200, data: visit, errors: false, message: "Visit added successfully" })
    }).catch(e => {
        console.log(e);
        res.json({ status: 500, data: null, errors: true, message: "Error while adding visit" })
    });
});

//Update a visit
// router.put("/:id", authorizePrivilege("UPDATE_AREA"), (req, res) => {
//     if (mongodb.ObjectId.isValid(req.params.id)) {
//         let result = FVisitController.verifyUpdate(req.body);
//         if (!isEmpty(result.errors)) {
//             return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
//         }
//         FVisit.findByIdAndUpdate(req.params.id, result.data, { new: true }).exec()
//             .then(doc => {
//                 doc.populate("hub").populate({path:"city",populate:{path:"state"}}).execPopulate().then(area=>{
//                     res.status(200).json({ status: 200, data: area, errors: false, message: "Area Updated Successfully" })
//                 }).catch(e => {
//                     console.log(e);
//                     res.json({ status: 500, data: null, errors: true, message: "Error while populating" })
//                 });
                
//             }).catch(err => {
//                 console.log(err);
//                 res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating area" })
//             })
//     }
//     else {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid city id" });
//     }
// })

//DELETE A visit
router.delete("/:id", authorizePrivilege("DELETE_FARM_VISIT"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Farm Visit Id" });
    }
    else {
        FVisit.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the farm visit" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Farm Visit deleted successfully!" });
            }
        })
    }
})

module.exports = router;