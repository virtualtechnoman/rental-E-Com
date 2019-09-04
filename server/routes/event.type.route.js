const EventType = require("../models/event.type.model");
const EventTypeController = require("../controllers/event.type.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get all event types
router.get("/", authorizePrivilege("GET_ALL_EVENT_TYPES"), (req, res) => {
    EventType.find().lean().exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All event types" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No event type found" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting event types" })
    })
});

//Add new event type
router.post('/', authorizePrivilege("ADD_NEW_EVENT_TYPE"), async (req, res) => {
    let result = EventTypeController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newEventType = new EventType(result.data);
    newEventType.save().then(_evType => {
            res.json({ status: 200, data: _evType, errors: false, message: "Event Type added successfully" })
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding event type" })
    });
});

//Update a event type
router.put("/:id", authorizePrivilege("UPDATE_EVENT_TYPE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = EventTypeController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        EventType.findByIdAndUpdate(req.params.id, {$set:result.data}, { new: true }).exec()
            .then(_eventType=>{
                    res.status(200).json({ status: 200, data: _eventType, errors: false, message: "Event Type Updated Successfully" });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating event type" })
            })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid event type id" });
    }
});

//DELETE A event type
router.delete("/:id", authorizePrivilege("DELETE_EVENT_TYPE"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid event type id" });
    }
    else {
        EventType.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the event type" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Event Type deleted successfully!" });
            }
        })
    }
});

module.exports = router;