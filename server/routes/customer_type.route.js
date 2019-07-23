const express = require('express');
const router = express.Router();
const CustomerType = require('../models/customerType.model');
const CustomerTypeCtrl = require('.././controllers/customer_type.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');

router.post('/', (req, res) => {
    let result = CustomerTypeCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newCountry = new CustomerType(result.data);
    newCountry.save()
        .then(Country => res.json(Country))
        .catch(err => console.log(err));
});

router.put('/:countryId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.countryId)) {
        let result = CustomerTypeCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        CustomerType.findByIdAndUpdate(req.params.countryId, result.data, { new: true }, function (err, Country) {
            if (!Country)
                res.status(404).send("data is not found");
            else res.send(Country);

        });
    } else res.send("ID NOT FOUND");
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
    CustomerType.find((err, Country) => {
        res.send(Country);
    })
        .catch(err => {
            res.status(400).send("no Country exists");
        });
}
);

router.delete('/:DistrictId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.DistrictId)) {
        CustomerType.findByIdAndDelete(req.params.DistrictId, (err, District) => {
            if (err) throw err;
            res.send(District)
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
        let newCity = new CustomerType({
            country_name: element.country_name,
            country_id: id,
            is_active: element.is_active.toLowerCase()
        });
        console.log("RESULT NEW BU ------>" + newCity)
        newCity.save()
            .then(City => {
                res.send(City);
            })
            .catch(err => console.log(err));
    });
    res.send({ res: "DONE" })
})