const express = require('express');
const router = express.Router();
const BU = require('../models/BU.model');
const buCtrl = require('.././controllers/bu.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const csv = require("fast-csv");
var fs = require('fs');
const moment = require('moment');
// @route   POST api/bu/add
// @desc    Add bu
// @access  Private

router.post('/', (req, res) => {
    console.log(req.body)
    let result = buCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newBU = new BU(result.data);
    newBU.save()
        .then(BU => res.json(BU))
        .catch(err => console.log(err));
});


// @route   PUT api/:id
// @desc    Return current bu
// @access  Private

router.put('/:BUId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.BUId)) {
        let result = buCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        BU.findByIdAndUpdate(req.params.BUId, result.data, { new: true }, (err, bu) => {
            if (!bu) res.status(404).send("data is not found")
            else res.send(bu);

        })
    } else res.send("ID NOT FOUND");
});


// @route   GET api/bu
// @desc    Return all bu 
// @access  Private

router.get('/', (req, res) => {
    BU.find((err, bu) => {
        res.send(bu);
    }).catch(err => {
        res.status(400).send("No Bu Exists !");
    });
});

// @route   DELETE api/bu/:productId
// @desc    Delete a  bu
// @access  Private

router.delete('/:BUId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.BUId)) {
        BU.deleteOne({ _id: req.params.BUId }, (err, bu) => {
            if (err) throw err;
            res.send(bu)
        })
            .catch(err => {
                res.status(400).send(err);
            })
    } else res.send("ID NOT FOUND")
});


module.exports = router;
router.post('/import', function (req, res, next) {
    var products = req.body;
    res.send({ res: "started" })
    products.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "BU" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        console.log("Element DATA===>>" + id, element.bu_name, element.is_active.toLowerCase());
        let newBU = new BU({
            bu_name: element.bu_name,
            bu_id: id,
            is_active: element.is_active.toLowerCase()
        });
        console.log("RESULT NEW BU ------>" + newBU)
        newBU.save()
            .then(BU => {
                res.send(BU);
            })
            .catch(err => console.log(err));
    });
    res.send({ res: "DONE" })
})
