const City = require("../models/city.model");
const CityController = require("../controllers/city.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get all cities
router.get("/", authorizePrivilege("GET_ALL_CITIES"), (req, res) => {
    City.find().populate("state").exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All cities" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No city found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting cities" })
    })
})

//Add new city
router.post('/', authorizePrivilege("ADD_NEW_CITY"), async (req, res) => {
    let result = CityController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newState = new City(result.data);
    newState.save().then(city => {
        city.populate("state").execPopulate().then(city=>{
            res.json({ status: 200, data: city, errors: false, message: "City added successfully" })
        }).catch(e => {
            console.log(e);
            res.json({ status: 500, data: null, errors: true, message: "Error while populating" })
        });
    }).catch(e => {
        console.log(e);
        res.json({ status: 500, data: null, errors: true, message: "Error while adding city" })
    });
});

//Update a city
router.put("/:id", authorizePrivilege("UPDATE_CITY"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = CityController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        City.findByIdAndUpdate(req.params.id, result.data, { new: true }).exec()
            .then(doc => {
                doc.populate("state").execPopulate().then(city=>{
                    res.status(200).json({ status: 200, data: city, errors: false, message: "City Updated Successfully" })
                }).catch(e => {
                    console.log(e);
                    res.json({ status: 500, data: null, errors: true, message: "Error while populating" })
                });
                
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating city" })
            })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid city id" });
    }
})

//DELETE A State
router.delete("/:id", authorizePrivilege("DELETE_CITY"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid city id" });
    }
    else {
        City.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the city" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "City deleted successfully!" });
            }
        })
    }
})

module.exports = router;