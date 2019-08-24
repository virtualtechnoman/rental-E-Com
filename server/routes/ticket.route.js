const express = require('express');
const isEmpty = require("../utils/is-empty");
const TicketController = require('../controllers/ticket.controller');
const Ticket = require('../models/ticket.model');
const mongodb = require("mongodb");
const CustomerOrder = require("../models/customer.order.model");
const moment = require('moment');
const authorizePrivilege = require("../middleware/authorizationMiddleware");
const router = express.Router();
const Product = require("../models/Products.model");

//GET own Tickets
router.get("/", authorizePrivilege("GET_TICKETS_OWN"), (req, res) => {
    Ticket.find({ created_by: req.user._id }, "ticket_number created_at status", {
        sort: {
            created_at: 'desc' //Sort by Date DESC
        }
    }).lean().exec().then(_tickets => {
        return res.json({ status: 200, data: _tickets, errors: false, message: "Your Tickets" });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting tickets" })
    })
})
//GET single Ticket
router.get("/id/:id", authorizePrivilege("GET_TICKET_OWN"), (req, res) => {
    Ticket.findOne({ created_by: req.user._id , _id:req.params.id }).lean().exec().then(_ticket => {
        return res.json({ status: 200, data: _ticket, errors: false, message: "Your Tickets" });
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting tickets" })
    })
})

//GET all tickets from all users
router.get("/all", authorizePrivilege("GET_TICKETS_ALL"), (req, res) => {
    Ticket.find().populate("created_by", "-password").sort({ created_at: 'desc' }).lean().exec().then(doc => {
        return res.json({ status: 200, data: doc, errors: false, message: "All Tickets" });
    }).catch(err => {
        return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
    });
})

// Add new ticket
router.post("/", authorizePrivilege("ADD_NEW_TICKET"), (req, res) => {
    let result = TicketController.verifyCreate(req.body);
    if (!isEmpty(result.errors))
        return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
    result.data.ticket_number = "TKT" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
    result.data.created_by = req.user._id;
    if (result.data.message && result.data.message.trim()) {
        let message = result.data.message;
        delete result.data.message;
        let newTicket = new Ticket(result.data);
        newTicket.messages.push({ customer: message });
        newTicket.save().then(_tkt => {
            _tkt.populate("created_by", "-password", (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating ticket" })
                } else {
                    return res.json({ status: 200, data: doc, errors: false, message: "Ticket generated successfully" });
                }
            })
        }).catch(e => {
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while generating ticket" });
        })
    } else {
        let newTicket = new Ticket(result.data);
        newTicket.save().then(_tkt => {
            _tkt.populate("created_by", "-password", (err, doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating ticket" })
                } else {
                    return res.json({ status: 200, data: doc, errors: false, message: "Ticket generated successfully" });
                }
            })
        }).catch(e => {
            return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while generating ticket" });
        })
    }
})

// Add new message on ticket from executive
router.put("/executive/:id", authorizePrivilege("ADD_NEW_MESSAGE_ON_TICKET_EXECUTIVE"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        let result = TicketController.verifyExecutiveMsg(req.body);
        if (!isEmpty(result.errors))
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
        Ticket.findByIdAndUpdate(req.params.id, { $set: { status: "Open" }, $push: { messages: { executive: req.body.message, executive_id: req.user._id } } }, { new: true })
            .populate([{ path: "created_by", select: "-password" }, { path: "messages.executive_id", select: "full_name" }]).lean().exec().then(_tkt => {
                return res.json({ status: 200, data: _tkt, errors: false, message: "Message sent successfully" });
            }).catch(_err => {
                console.log(_err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating ticket" })
            })
    } else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
    }
})
// Add new message on ticket from customer
router.put("/customer/:id", authorizePrivilege("ADD_NEW_MESSAGE_ON_TICKET_CUSTOMER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        let result = TicketController.verifyExecutiveMsg(req.body);
        if (!isEmpty(result.errors))
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
        Ticket.findByIdAndUpdate(req.params.id, { $set: { status: "Open" }, $push: { messages: { customer: req.body.message } } }, { new: true })
            .populate({ path: "created_by", select: "-password" }).lean().exec().then(_tkt => {
                return res.json({ status: 200, data: _tkt, errors: false, message: "Message sent successfully" });
            }).catch(_err => {
                console.log(_err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating ticket" })
            })
    } else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
    }
})
// Close a ticket
router.put("/close/:id", authorizePrivilege("CLOSE_TICKET"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
       Ticket.findByIdAndUpdate(req.params.id, { $set: { status: "Close" }}, { new: true })
            .populate({ path: "created_by", select: "-password" }).lean().exec().then(_tkt => {
                return res.json({ status: 200, data: _tkt, errors: false, message: "Ticket Closed Successfully" });
            }).catch(_err => {
                console.log(_err);
                res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating ticket" })
            })
    } else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
    }
})


// Delete a ticket
router.delete("/:id", authorizePrivilege("DELETE_TICKET"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
    }
    else {
        Ticket.findByIdAndDelete(req.params.id).exec().then(_tkt => {
            res.json({ status: 200, data: _tkt, errors: false, message: "Ticket deleted successfully!" });
        }).catch(er => {
            console.log(er);
            return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the ticket" })
        })
    }
})


module.exports = router;