const MarketingMaterial = require("../models/marketing.material.model");
const MarketingMaterialController = require("../controllers/marketing.material.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");

// Get all marketing material types
router.get("/", authorizePrivilege("GET_ALL_MARKETING_MATERIALS"), (req, res) => {
    MarketingMaterial.find().lean().exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All marketing material" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No marketing material found" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting marketing materials" })
    })
});

//Add new marketing materials
router.post('/', authorizePrivilege("ADD_NEW_MARKETING_MATERIAL"), async (req, res) => {
    let result = MarketingMaterialController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let mktMaterial = new MarketingMaterial(result.data);
    mktMaterial.save().then(_mktMat => {
            res.json({ status: 200, data: _mktMat, errors: false, message: "Marketing Material added successfully" })
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding marketing material" })
    });
});

//Update a event type
router.put("/:id", authorizePrivilege("UPDATE_MARKETING_MATERIAL"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = MarketingMaterialController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        MarketingMaterial.findByIdAndUpdate(req.params.id, {$set:result.data}, { new: true }).exec()
            .then(_mktMat=>{
                    res.status(200).json({ status: 200, data: _mktMat, errors: false, message: "Matrketing Material Updated Successfully" });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating marketing material" })
            })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid marketing material id" });
    }
});

//DELETE A event type
router.delete("/:id", authorizePrivilege("DELETE_MARKETING_MATERIAL"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid marketing material id" });
    }
    else {
        MarketingMaterial.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the marketing material" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Marketing Material deleted successfully!" });
            }
        })
    }
});

module.exports = router;