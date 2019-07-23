const express = require('express');
const router = express.Router();
const District = require('../models/district.model');
const districtCtrl = require('.././controllers/district.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');

router.post('/', (req, res) => {
    let result = districtCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newDistrict = new District(result.data);
    newDistrict.save()
        .then(District => res.json(District))
        .catch(err => console.log(err));
});

router.put('/:DistrictId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.DistrictId)) {
        let result = districtCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        else {
            District.findByIdAndUpdate(req.params.DistrictId, result.data, { new: true }, function (err, district) {
                try {
                    res.setHeader("Content-Type", "text/html");
                    res.status(200).json(district);
                    res.end();
                } catch (error) {
                    res.setHeader("Content-Type", "text/html");
                    res.status(500).json(error);
                    res.end();
                }
            });
        }
    } else res.status(404).send("ID NOT FOUND");
}
);

router.get('/city/:cityId', (req, res) => {
    District.find({city : req.params.cityId}, (err, District) => {
        res.status(200).send(District);
    })
    .populate('city')
        .catch(err => {
            res.status(400).send("no districts exists");
        });
});

router.get('/', (req, res) => {
    District.find((err, District) => {
        res.status(200).send(District);
    })
        .catch(err => {
            res.status(400).send("no districts exists");
        });
});

router.delete('/:DistrictId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.DistrictId)) {
        District.deleteOne({ _id: req.params.DistrictId }, (err, District) => {
            if (err) throw err;
            res.status(200).send(District)
        })
            .catch(err => {
                res.status(400).send(err);
            });
    } else res.status(404).send("ID NOT FOUND")
}
);


module.exports = router;

router.post('/import', function (req, res, next) {
    var district = req.body;
    district.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "DIST" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        console.log("Element DATA===>>" + id, element.district_name, element.is_active.toLowerCase(), element.city_id);
        let newDistrict = new District({
            district_name: element.district_name,
            district_id: id,
            city_id: element.city_id,
            city_name: element.city_name,
            region_id: element.region_id,
            region_name: element.region_name,
            country_id: element.country_id,
            country_name: element.country_name,
            is_active: element.is_active.toLowerCase()
        });
        newDistrict.save()
            .then(BU => {
                res.status(200).send(BU);
                console.log("SAVE" + BU)
                return
            })
            .catch(err => console.log("SAVE ERROR==>" + err));
    });
})
