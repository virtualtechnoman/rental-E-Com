const Event = require("../models/event.model");
const EventController = require("../controllers/event.controller");
const router = require("express").Router();
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const moment = require('moment');
const authorizePrivilege = require("../middleware/authorizationMiddleware");
// Get all events
router.get("/all", authorizePrivilege("GET_ALL_EVENTS"), (req, res) => {
    Event.find().populate([{ path: "type city organizer" }, { path: "incharge created_by farm hub", select: "-password" }]).lean().exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All events" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No event found" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting events" })
    })
});
// Get all event created by self
router.get("/", authorizePrivilege("GET_ALL_EVENTS_OWN"), (req, res) => {
    Event.find({ created_by: req.user._id }).populate([{ path: "type city organizer" }, { path: "incharge farm hub", select: "-password" }]).lean().exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All events" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No event types" });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting events" })
    })
});

//Add new event
router.post('/', authorizePrivilege("ADD_NEW_EVENT"), async (req, res) => {
    let result = EventController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    result.data.created_by = req.user._id;
    result.data.event_id = "EVNT" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
    let newEventType = new Event(result.data);
    newEventType.save().then(_ev => {
        _ev.populate([{ path: "type city organizer" }, { path: "incharge created_by farm hub", select: "-password" }]).execPopulate().then(_evnt => {
            res.json({ status: 200, data: _evnt, errors: false, message: "Event Type added successfully" })
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, data: null, errors: true, message: "Event added but error occured while populating fields" });
        })
    }).catch(e => {
        console.log(e);
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while adding event type" })
    });
});

//Update a event type
router.put("/cancel/:id", authorizePrivilege("CANCEL_EVENT"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        Event.findById(req.params.id).exec().then(_evnt => {
            if (_evnt.cancelled) {
                return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Event Already Cancelled" });
            }
            Event.findByIdAndUpdate(req.params.id,{cancelled : true},{new:true}).populate([{ path: "type city organizer" }, { path: "incharge created_by farm hub", select: "-password" }]).exec()
            .then(_ev => {
                res.status(200).json({ status: 200, data: _ev, errors: false, message: "Event Cancelled Successfully" });
            }).catch(err => {
                console.log(err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while cancelling event" })
            })
        })
    }
    else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid event type id" });
    }
});
//Update a event type
// router.put("/:id", authorizePrivilege("UPDATE_EVENT_TYPE"), (req, res) => {
//     if (mongodb.ObjectId.isValid(req.params.id)) {
//         let result = EventController.verifyUpdate(req.body);
//         if (!isEmpty(result.errors)) {
//             return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
//         }
//         Event.findByIdAndUpdate(req.params.id, {$set:result.data}, { new: true }).exec()
//             .then(_eventType=>{
//                     res.status(200).json({ status: 200, data: _eventType, errors: false, message: "Event Type Updated Successfully" });
//             }).catch(err => {
//                 console.log(err);
//                 res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating event type" })
//             })
//     }
//     else {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid event type id" });
//     }
// });

//DELETE A event type
// router.delete("/:id", authorizePrivilege("DELETE_EVENT_TYPE"), (req, res) => {
//     if (!mongodb.ObjectId.isValid(req.params.id)) {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid event type id" });
//     }
//     else {
//         Event.findByIdAndDelete(req.params.id, (err, doc) => {
//             if (err) {
//                 return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the event type" })
//             }
//             if (doc) {
//                 res.json({ status: 200, data: doc, errors: false, message: "Event Type deleted successfully!" });
//             }
//         })
//     }
// });

module.exports = router;