const express = require('express');
const router = express.Router();
const Sales = require('../models/sales.model');
const salesCtrl = require('.././controllers/sales.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');

router.post('/', (req, res) => {
    let result = salesCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newSales = new Sales(result.data);
    newSales.save()
        .then(Sales => res.json(Sales))
        .catch(err => console.log(err));
});

router.put('/:SalesId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.SalesId)) {
        let result = salesCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Sales.findByIdAndUpdate(req.params.SalesId, result.data, { new: true }, function (err, Sales) {
            if (!Sales)
                res.status(404).send("data is not found");
            else res.send(Sales);

        });
    } else res.send("ID NOT FOUND");
}
);

router.get('/:counrtyID', (req, res) => {
    Sales.find(country_id = req.params.counrtyID, (err, Sales) => {
        res.status(200).send(Sales);
    })
        .catch(err => {
            res.status(400).send("no Sales exists");
        });
});

router.get('/', (req, res) => {
    Sales.find((err, Sales) => {
        res.send(Sales);
    })
        .catch(err => {
            res.status(400).send("no Sales exists");
        });
});

router.delete('/:SalesId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.SalesId)) {
        Sales.deleteOne({ _id: req.params.SalesId }, (err, Sales) => {
            if (err) throw err;
            res.send(Sales)
        })
            .catch(err => {
                res.status(400).send(err);
            });
    } else res.send("ID NOT FOUND")
}
);


module.exports = router;


router.post('/import', function (req, res, next) {
    var Sales = req.body;
    Sales.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "SLS" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        console.log("Element DATA===>>" + id, element.Sales_name, element.is_active.toLowerCase());
        let newSales = new Sales({
            invoice_number: element.invoice_name,
            invoice_date: element.invoice_date,
            region: element.region,
            sector:element.sector,
            customer_name:element.customer_name,
            customer_id:element.customer_id,
            product_id:element.product_id,
            product_name:element.product_name,
            quantity:element.quantity,
            price:element.price,
            gross_amount:element.gross_amount,
            discount:element.discount,
            net_price:element.net_price,
            foc:element.foc,
            is_active: element.is_active.toLowerCase(),
            country_id: element.country_id
        });
        newSales.save()
            .then(BU => {
                res.send(BU);
                console.log(BU)
            })
            .catch(err => console.log(err));
    });
})