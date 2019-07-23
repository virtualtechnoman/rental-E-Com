const express = require('express');
const router = express.Router();
const Country = require('../models/country.model');
const countryCtrl = require('.././controllers/country.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');

router.post('/', (req, res) => {
    let result = countryCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newCountry = new Country(result.data);
    newCountry.save()
        .then(Country => res.json(Country))
        .catch(err => console.log(err));
});

router.put('/:countryId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.countryId)) {
        let result = countryCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Country.findByIdAndUpdate(req.params.countryId, result.data, { new: true }, function (err, Country) {
            console.log(Country)
            if (!Country)
                res.status(404).send("data is not found");
            else res.status(200).send(Country);

        });
    } else res.status(404).send("ID NOT FOUND");
}
);

router.get('/:company_id', (req, res) => {
    Country.find(company_id = req.params.company_id, (err, Country) => {
        res.send(Country);
    })
        .catch(err => {
            res.status(400).send("no districts exists");
        });
}
);

router.get('/', (req, res) => {
    Country.find((err, Country) => {
        res.status(200).send(Country);
    })
        .catch(err => {
            res.status(400).send("no Country exists");
        });
}
);

router.delete('/:DistrictId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.DistrictId)) {
        Country.findByIdAndDelete(req.params.DistrictId, (err, District) => {
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
    var city = req.body;
    res.status(200).send({ res: "started" })
    city.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "CTY" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        let newCity = new Country({
            country_name: element.country_name,
            country_id: id,
            is_active: element.is_active.toLowerCase()
        });
        newCity.save()
            .then(City => {
                res.status(200).send(City);
            })
            .catch(err => console.log(err));
    });
    res.status(200).send({ res: "DONE" })
})