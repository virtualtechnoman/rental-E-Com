const express = require('express');
const router = express.Router();
const Customer = require('../models/customer.model');
const customerCtrl = require('.././controllers/customer.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');

// @route   POST api/bu/add
// @desc    Add bu
// @access  Private

router.post('/', (req, res) => {
    let result = customerCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newCustomer = new Customer(result.data);
    newCustomer.save()
        .then(customer => res.json(customer))
        .catch(err => res.status(400).json(err));
});

router.put('/:customerId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.customerId)) {
        let result = customerCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
            return;
        }
        Customer.findByIdAndUpdate(req.params.customerId, result.data, { new: true }, (err, customer) => {
            if (!customer) {
                try {
                    res.setHeader("Content-Type", "text/html");
                    res.status(200).send(" DATA NOT FOUND");
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
                    res.status(200).send(customer);
                    return res.end();
                } catch (error) {
                    res.status(500).send(error);
                    return res.end();
                }
            }
        })
    } else {
        res.setHeader("Content-Type", "text/html");
        res.status(404).send("ID NOT FOUND");
        return res.end();
    }
});



// @route   GET api/products
// @desc    Return all users
// @access  Private

router.get('/', (req, res) => {
    Customer.find((err, customer) => {
        res.send(customer);
    }).catch(err => {
        res.status(400).send("No Bu Exists !");
    });
});

// @route   DELETE api/bu/:productId
// @desc    Delete a  bu
// @access  Private

router.delete('/:CustomerId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.CustomerId)) {
        Customer.deleteOne({ _id: req.params.CustomerId }, (err, customer) => {
            if (err) throw err;
            res.send(customer)
        })
            .catch(err => {
                res.status(400).send(err);
            })
    } else res.send("ID NOT FOUND")
});


module.exports = router;

router.post('/import', function (req, res, next) {
    var customer = req.body;
    var arr = [];
    customer.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "CUS" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        let newCustomer = new Customer({
            customer_name: element.customer_name,
            customer_id: id,
            distirbutor_1_name: element.distirbutor_1_name,
            distirbutor_2_name: element.distirbutor_2_name,
            distirbutor_3_name: element.distirbutor_3_name,
            share_1: element.share_1,
            share_2: element.share_2,
            share_3: element.share_3,
            is_active: element.is_active.toLowerCase(),
            shares: element.shares,
            district_name: element.district_name,
            type: element.type,
            sector: element.sector,
            notes: element.notes,
        });
        newCustomer.save()
            .then(BU => {
                arr.push(BU)
            })
            .catch(err => console.log(err));
    });
    res.status(200).send(arr);
})
