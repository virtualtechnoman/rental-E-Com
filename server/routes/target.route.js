const express = require('express');
const router = express.Router();
const Target = require('../models/target.model');
const targetCtrl = require('.././controllers/target.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');

// @route   POST api/therapy/
// @desc    Add Therapy
// @access  Private

router.post('/', async (req, res) => {
    let result = targetCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newTherapy = new Target(result.data);
    newTherapy
        .save()
        .then(therapy => res.json(therapy))
        .catch(err => console.log(err));
}
);


// @route   PUT api/therapy/:id
// @desc    update a therapy
// @access  Private

router.put('/:therapyId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.therapyId)) {
        let result = targetCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Target.findByIdAndUpdate(req.params.therapyId, result.data, { new: true }, function (err, therapy) {
            if (!therapy)
                res.status(404).send("data is not found");
            else
                res.send(therapy);
        })
    } else {
        res.send("ID NOT FOUND");
    }
});


// @route   GET api/therapy
// @desc    Return all therapy
// @access  Private
router.get('/', (req, res) => {
    Target.find((err, therapy) => {
        res.send(therapy);
    })
        .catch(err => {
            res.status(400).send("Update not possible");
        });
});

// @route   DELETE api/therapy:therapyId
// @desc    Delete a  Therapy
// @access  Private
router.delete('/:therapyId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.therapyId)) {
        Target.deleteOne({ _id: req.params.therapyId }, (err, therapy) => {
            if (err) throw err;
            res.json({ success: true, message: "Therapy is deleted successfully" })
        })
            .catch(err => {
                res.status(400).send(err);
            });

    } else {
        res.send("ID NOT FOUND")
    }
}
);


module.exports = router;


router.post('/import', function (req, res, next) {
    var therapy = req.body;
    var arr = [];
    therapy.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "THE" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        let newTherapy = new Target({
            bu: element.bu,
            bu_id: id,
            is_active: element.is_active.toLowerCase(),
            notes: element.notes,
            therapyline: element.therapyline,
            therapyline_id: element.therapyline_id
        });
        newTherapy.save()
            .then(BU => {
                arr.push(BU)
                console.log(arr)
            })
            .catch(err => {
                console.log(err);
            });
    });
    res.status(200).send(arr);
})

router.get('/:sku_id', (req, res) => {
    Target.find({ product_id: req.params.sku_id }, (err, therapy) => {
        res.send(therapy);
    })
        .catch(err => {
            res.status(400).send("Update not possible");
        });
});