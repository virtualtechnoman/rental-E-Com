const express = require('express');
const isEmpty = require("../utils/is-empty");
const ChatController = require('../controllers/chat.controller');
const Chat = require('../models/chat.model');
const mongodb = require("mongodb");
const authorizePrivilege = require("../middleware/authorizationMiddleware");
const router = express.Router();

// //GET own Tickets
// router.get("/", authorizePrivilege("GET_TICKETS_OWN"), (req, res) => {
//     Chat.find({ created_by: req.user._id }, null, {
//         sort: {
//             created_at: 'desc' //Sort by Date DESC
//         }
//     }).lean().exec().then(_tickets => {
//         return res.json({ status: 200, data: _tickets, errors: false, message: "Your Tickets" });
//     }).catch(err => {
//         console.log(err);
//         return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting tickets" })
//     })
// })

// //GET all tickets from all users
// router.get("/all", authorizePrivilege("GET_TICKETS_ALL"), (req, res) => {
//     Chat.find().populate("created_by", "-password").sort({ created_at: 'desc' }).lean().exec().then(doc => {
//         return res.json({ status: 200, data: doc, errors: false, message: "All Tickets" });
//     }).catch(err => {
//         return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
//     });
// })

// Create a chat
router.post("/", authorizePrivilege("CREATE_NEW_CHAT"), (req, res) => {
    let result = ChatController.verifyCreate(req.body);
    if (!isEmpty(result.errors))
        return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
    let newChat = new Chat({
        created_by: req.user._id
    })
    newChat.messages.push({ customer: req.body.message });
    newChat.save().then(_chat => {
        _chat.responded_by = null;
        return res.json({ status: 200, data: _chat, errors: false, message: "Chat created successfully" });

    }).catch(e => {
        return res.status(500).json({ status: 500, errors: true, data: null, message: "Error while creating chat" });
    })
})

//Refresh chat
router.get("/:id", authorizePrivilege("CREATE_NEW_CHAT"), (req, res) => {
    Chat.findById(req.params.id).populate("responded_by").exec().then(_cht => {
        if (_cht.is_open) {
            if (_cht.responded_by) {
                return res.json({ status: 200, data: _cht, errors: false, message: "Your chat" });
            }
            _cht.responded_by = null;
            return res.json({ status: 200, data: _cht, errors: false, message: "Your chat" });
        } else {
            return res.status(400).json({ status: 400, errors: true, data: null, message: "Chat is closed" });
        }
    })
})

// Add new message on chat from executive
router.put("/executive/:id", authorizePrivilege("ADD_NEW_MESSAGE_ON_CHAT_EXECUTIVE"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        let result = ChatController.verifyUpdate(req.body);
        if (!isEmpty(result.errors))
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
        Chat.findById(req.params.id).exec().then(_chat => {
            if (_chat) {
                if (_chat.is_open) {
                    if (!_chat.responded_by) {
                        _chat.responded_by = req.user._id;
                    }
                    _chat.messages.push({ executive: req.body.message });
                    _chat.save().then(_cht => {
                        _cht.populate("responded_by").execPopulate().then(_cht => {
                            if (_chat.responded_by)
                                return res.json({ status: 200, data: _cht, errors: false, message: "Message sent successfully" });
                            else {
                                _chat.responded_by = null;
                                return res.json({ status: 200, data: _cht, errors: false, message: "Message sent successfully" });
                            }
                        })
                    })
                } else {
                    res.status(400).json({ status: 400, data: null, errors: true, message: "Can't message to the closed chat" });
                }
            } else {
                res.status(400).json({ status: 400, data: null, errors: true, message: "Chat not exist" });
            }
        })
    } else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
    }
})
// Add new message on chat from customer
router.put("/customer/:id", authorizePrivilege("ADD_NEW_MESSAGE_ON_CHAT_CUSTOMER"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        let result = ChatController.verifyUpdate(req.body);
        if (!isEmpty(result.errors))
            return res.status(400).json({ status: 400, errors: result.errors, data: null, message: "Fields required" });
        Chat.findById(req.params.id).exec().then(_chat => {
            if (_chat) {
                if (_chat.is_open) {
                    _chat.messages.push({ customer: req.body.message });
                    _chat.save().then(_cht => {
                        _cht.populate("responded_by").execPopulate().then(_cht => {
                            if (_chat.responded_by)
                                return res.json({ status: 200, data: _cht, errors: false, message: "Message sent successfully" });
                            else {
                                _chat.responded_by = null;
                                return res.json({ status: 200, data: _cht, errors: false, message: "Message sent successfully" });
                            }
                        })
                    }).catch(_err => {
                        console.log(_err);
                        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating ticket" })
                    })
                } else {
                    res.status(400).json({ status: 400, data: null, errors: true, message: "Can't message to the closed chat" });
                }
            } else {
                res.status(400).json({ status: 400, data: null, errors: true, message: "Chat not exist" });
            }
        })
    } else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
    }
})
// Close a chat
router.put("/close/:id", authorizePrivilege("CLOSE_CHAT"), (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Chat.findByIdAndUpdate(req.params.id, { $set: { is_open: false } }, { new: true }).lean().exec().then(_cht => {
            return res.json({ status: 200, data: _cht, errors: false, message: "Chat Closed Successfully" });
        }).catch(_err => {
            console.log(_err);
            res.status(500).json({ status: 500, data: null, errors: true, message: "Error while populating ticket" })
        })
    } else {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
    }
})


// Delete a ticket
// router.delete("/:id", authorizePrivilege("DELETE_TICKET"), (req, res) => {
//     if (!mongodb.ObjectId.isValid(req.params.id)) {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid Ticket Id" });
//     }
//     else {
//         Chat.findByIdAndDelete(req.params.id).exec().then(_tkt => {
//             res.json({ status: 200, data: _tkt, errors: false, message: "Ticket deleted successfully!" });
//         }).catch(er => {
//             console.log(er);
//             return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the ticket" })
//         })
//     }
// })


module.exports = router;