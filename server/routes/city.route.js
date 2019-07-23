const express = require('express');
const router = express.Router();
const City = require('../models/city.model');
const cityCtrl = require('.././controllers/city.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');


router.post('/', (req, res) => {
    let result = cityCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newCity = new City(req.body);
    newCity.save()
        .then(City => res.json(City))
        .catch(err => console.log(err));
});



router.put('/:id', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.id)) {
        let result = cityCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json(result.errors);
        }
        City.findByIdAndUpdate(req.params.id, result.data, { new: true }, function (err, city) {
            if (!city) {
                try {
                    res.setHeader("Content-Type", "text/html");
                    res.status(404).send("City Not Found");
                    return res.end();
                } catch (error) {
                    res.setHeader("Content-Type", "text/html");
                    res.status(500).send(error);
                    return res.end();
                }
            }
            else {
                try {
                    res.setHeader("Content-Type", "text/html");
                    res.status(200).send(city);
                    return res.end();
                } catch (error) {
                    return res.status(500).send(error);
                }
            }
        });
    } else {
        try {
            res.setHeader("Content-Type", "text/html");
            res.status(404).send("ID NOT FOUND");
            return res.end();
        } catch (error) {
            return res.status(500).send(error);
        }
    }
});

router.get('/', (req, res) => {
    City.find((err, City) => {
        res.status(200).send(City);
    })
        .populate({
            path: 'region', populate: {
                path: 'country'
            }
        })
        .catch(err => {
            res.status(400).send("No city Exists !");
        });
}
);

router.get('/region/:regionID', (req, res) => {
    City.find({ region: req.params.regionID }, (err, City) => {
        res.status(200).send(City);
    })
        .populate('region')
        .catch(err => {
            console.log(err)
            // res.status(400).send("No city Exists !");
        });
}
);

router.delete('/:CityId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.CityId)) {
        City.deleteOne({ _id: req.params.CityId }, (err, City) => {
            if (err) throw err;
            res.send(City)
        })
            .catch(err => {
                res.status(400).send(err);
            });
    } else res.send("ID NOT FOUND")
}
);


module.exports = router;

router.post('/import', function (req, res, next) {
    var city = req.body;
    res.send({ res: "started" })
    city.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "CTY" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        let newCity = new City({
            city_name: element.city_name,
            city_id: id,
            region_id: element.region_id,
            region_name: element.region_name,
            country_id: element.country_id,
            country_name: element.country_name,
            is_active: element.is_active.toLowerCase()
        });
        newCity.save()
            .then(City => {
                res.send(City);
            })
            .catch(err => console.log(err));
    });
    res.send({ res: "DONE" })
})
