const express = require('express');
const router = express.Router();
const Company = require('../models/company.model');
const companyCtrl = require('.././controllers/company.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');

// @route   POST api/bu/add
// @desc    Add bu
// @access  Private

router.post('/', (req, res) => {
    let result = companyCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newCompany = new Company(result.data);
    newCompany.save()
        .then(company => res.json(company))
        .catch(err => console.log(err));
});


// @route   PUT api/:id
// @desc    Return current bu
// @access  Private

router.put('/:CompanyId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.CompanyId)) {
        let result = companyCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Company.findByIdAndUpdate(req.params.CompanyId, result.data, { new: true }, (err, company) => {
            if (!company) res.status(404).send("data is not found")
            else res.send(company);

        })
    } else res.send("ID NOT FOUND");
});


// @route   GET api/bu
// @desc    Return all bu 
// @access  Private

router.get('/', (req, res) => {
    Company.find((err, company) => {
        res.send(company);
    }).catch(err => {
        res.status(400).send("No Bu Exists !");
    });
});

// @route   DELETE api/bu/:productId
// @desc    Delete a  bu
// @access  Private

router.delete('/:CompanyId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.CompanyId)) {
        Company.deleteOne({ _id: req.params.CompanyId }, (err, company) => {
            if (err) throw err;
            res.send(company)
        })
            .catch(err => {
                res.status(400).send(err);
            })
    } else res.send("ID NOT FOUND")
});


module.exports = router;
