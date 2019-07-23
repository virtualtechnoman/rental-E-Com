const express = require('express');
const router = express.Router();
const Distirbutor = require('../models/distirbutor.model');
const distirbutorCtrl = require('.././controllers/distirbutor.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');
// @route   POST api/bu/add
// @desc    Add bu
// @access  Private

router.post('/', (req, res) => {
    console.log(req.body)
    let result = distirbutorCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newDistirbutor = new Distirbutor(result.data);
    newDistirbutor.save()
        .then(Distirbutor => res.json(Distirbutor))
        .catch(err => console.log(err));
});


// @route   PUT api/:id
// @desc    Return current bu
// @access  Private

router.put('/:id', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        let result = distirbutorCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            try {
                res.status(400).json(result.errors);
            } catch (error) {
                res.status(500).json(error);
            }
        }
        Distirbutor.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, bu) => {
            if (!bu) {
                try {
                    res.setHeader("Content-Type", "text/html");
                    res.status(404).send("Data Not Found");
                    res.end();
                } catch (error) {
                    res.setHeader("Content-Type", "text/html");
                    res.status(500).send(error)
                    res.end();
                }
            }
            else {
                try {
                    res.setHeader("Content-Type", "text/html");
                    res.status(200).send(bu);
                    res.end();
                } catch (error) {
                    res.setHeader("Content-Type", "text/html");
                    res.status(500).send(error);
                    res.end();
                }
            }

        })
    } else res.send("ID NOT FOUND");
});


// @route   GET api/bu
// @desc    Return all bu 
// @access  Private

router.get('/', (req, res) => {
    Distirbutor.find((err, bu) => {
        try {
            res.setHeader("Content-Type", "text/html");
            res.status(200).send(bu);
            res.end();
        } catch (error) {
            res.setHeader("Content-Type", "text/html");
            res.status(500).send(error);
            res.end();
        }
    }).catch(err => {
        res.setHeader("Content-Type", "text/html");
        res.status(404).send(" DATA NOT FOUND");
        res.end();
    });
});

// @route   DELETE api/bu/:productId
// @desc    Delete a  bu
// @access  Private

router.delete('/:id', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        Distirbutor.deleteOne({ _id: req.params.id }, (err, bu) => {
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
    var distirbutor = req.body;
    var arr = [];
    distirbutor.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "DISB" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        let newDistirbutor = new Distirbutor({
            distirbutor_name: element.distirbutor_name,
            distirbutor_id: id,
            is_active: element.is_active.toLowerCase(),
        });
        newDistirbutor.save()
            .then(BU => {
                arr.push(BU)
            })
            .catch(err => console.log(err));
    });
    res.status(200).send(arr);
})