const EventOrganizer = require("../models/event.organizer.model");
const EventOrganizerController = require("../controllers/event.organizer.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get all event organizers
router.get("/", authorizePrivilege("GET_ALL_EVENT_ORGANIZERS"), (req, res) => {
    EventOrganizer.find().lean().exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All event organizers" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No event organizer found" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting event organizers" })
    })
});

//Add new event organizer
router.post('/', authorizePrivilege("ADD_NEW_EVENT_ORGANIZER"), async (req, res) => {
    let result = EventOrganizerController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newEventOrganizer = new EventOrganizer(result.data);
    newEventOrganizer.save().then(_evOrganizer => {
        res.json({ status: 200, data: _evOrganizer, errors: false, message: "Event Organizer added successfully" })
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding event organizer" })
    });
});

//Update a event organizer
router.put("/id/:id", authorizePrivilege("UPDATE_EVENT_ORGANIZER"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = EventOrganizerController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        EventOrganizer.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }).exec()
            .then(_eventType => {
                res.status(200).json({ status: 200, data: _eventType, errors: false, message: "Event Organizer Updated Successfully" });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating event organizer" })
            })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid event organizer id" });
    }
});

//DELETE A event organizer
router.delete("/:id", authorizePrivilege("DELETE_EVENT_ORGANIZER"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid event organizer id" });
    }
    else {
        EventOrganizer.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the event organizer" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Event Organizer deleted successfully!" });
            }
        })
    }
});

module.exports = router;