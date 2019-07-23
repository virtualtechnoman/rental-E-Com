const express = require('express');
const router = express.Router();
const Country = require('../models/country.model');
const Region = require('../models/region.model');
const regionCtrl = require('.././controllers/region.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');

router.post('/', (req, res) => {
    let result = regionCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.setHeader("Content-Type", "text/html");
        res.status(400).json(result.errors);
        res.end();
    }
    let newRegion = new Region(result.data);
    newRegion.save()
        .then(Region => {
            res.setHeader("Content-Type", "text/html");
            res.status(200).json(Region)
            res.end();
        })
        .catch(err => {
            res.setHeader("Content-Type", "text/html");
            res.sendStatus(500).send(err)
            res.end();
        });
});

router.put('/:RegionId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.RegionId)) {
        let result = regionCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Region.findByIdAndUpdate(req.params.RegionId, result.data, { new: true }, function (err, Region) {
            try {
                res.setHeader("Content-Type", "text/html");
                res.status(200).send(Region);
                res.end();
            } catch (error) {
                res.setHeader("Content-Type", "text/html");
                res.send(error);
                res.end();
            }
        }).catch(err => {
            res.setHeader("Content-Type", "text/html");
            res.send(500).send(err)
            res.end();
        });
    } else {
        res.setHeader("Content-Type", "text/html");
        res.send("ID NOT FOUND");
        res.end();
    }
});

router.get('/country/:counrtyID', (req, res) => {
    Region.find({country : req.params.counrtyID}, (err, Region) => {
        try {
            res.status(200).send(Region);
            return res.end();
        } catch (error) {
        }
    })
        .populate('country')
        .catch(err => {
            // res.setHeader("Content-Type", "text/html");
            // res.status(400).send("no region exists");
            console.log(err)
            // return res.end();
        });
});

router.get('/', (req, res) => {
    try {
        Region.find((err, Region) => {
            res.status(200).json(Region);
            console.log(err)
        })
            .populate('country')
            .exec()
            .catch(err => {
                res.setHeader("Content-Type", "text/html");
                // res.status(200).send(Region);
                // return res.end();
            });
    } catch (error) {
        // res.status(500).json(error)
    }
});

router.delete('/:RegionId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.RegionId)) {
        Region.deleteOne({ _id: req.params.RegionId }, (err, Region) => {
            if (err) throw err;
            res.setHeader("Content-Type", "text/html");
            res.status(200).send(Region)
            return res.end();
        })
            .catch(err => {
                res.setHeader("Content-Type", "text/html");
                res.status(400).send(err);
                return res.end();
            });
    } else {
        res.setHeader("Content-Type", "text/html");
        res.status(200).send("ID NOT FOUND")
        return res.end();
    }
});


module.exports = router;


router.post('/import', function (req, res, next) {
    var region = req.body;
    region.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "REG" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        let newRegion = new Region({
            region_name: element.region_name,
            region_id: id,
            is_active: element.is_active.toLowerCase(),
            country_id: element.country_id,
            country_name: element.country_name
        });
        newRegion.save()
            .then(BU => {
                res.send(BU);
                console.log(BU)
            })
            .catch(err => console.log(err));
    });
    res.send({ res: "DONE" })
})
