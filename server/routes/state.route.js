const State = require("../models/state.model");
const StateController = require("../controllers/state.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get all states
router.get("/", authorizePrivilege("GET_ALL_STATES"), (req, res) => {
    State.find().exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All states" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No state found" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting states" })
    })
})

//Add new state
router.post('/', authorizePrivilege("ADD_NEW_STATE"), async (req, res) => {
    let result = StateController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newState = new State(result.data);
    newState.save().then(state => {
        res.json({ status: 200, data: state, errors: false, message: "State added successfully" })
    }).catch(e => {
        console.log(e);
        res.json({ status: 500, data: null, errors: true, message: "Error while adding state" })
    });
});

//Update a state
router.put("/:id", authorizePrivilege("UPDATE_STATE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = StateController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        State.findByIdAndUpdate(req.params.id, result.data, { new: true }).exec()
            .then(doc => {
                res.status(200).json({ status: 200, data: doc, errors: false, message: "State Updated Successfully" })
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating state" })
            })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid state id" });
    }
})

//DELETE A State
router.delete("/:id", authorizePrivilege("DELETE_STATE"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid product id" });
    }
    else {
        State.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the state" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "State deleted successfully!" });
            }
        })
    }
})

module.exports = router;