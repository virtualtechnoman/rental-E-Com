const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory.model');
const inventoryCtrl = require('.././controllers/inventory.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');

// @route   POST api/bu/add
// @desc    Add bu
// @access  Private

router.post('/', (req, res) => {
    let result = inventoryCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.setHeader("Content-Type", "text/html");
        res.status(400).json(result.errors);
        res.end();
    }
    let newInventory = new Inventory(result.data);
    newInventory.save()
        .then(inventory => {
            res.setHeader("Content-Type", "text/html");
            res.status(200).json(inventory);
            res.end();
        })
        .catch(err => res.send(err));
});


// @route   PUT api/:id
// @desc    Return current bu
// @access  Private

router.put('/:InventoryId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.InventoryId)) {
        let result = inventoryCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Inventory.findByIdAndUpdate(req.params.InventoryId, result.data, { new: true }, (err, inventory) => {
            if (!inventory) {
                res.setHeader("Content-Type", "text/html");
                res.status(404).send("Data Not Found");
                res.end();
            }
            else {
                try {
                    res.setHeader("Content-Type", "text/html");
                    res.send(inventory);
                    res.end();
                } catch (error) {
                    res.status(500)
                }
            }
        })
    } else res.send("ID NOT FOUND");
});


// @route   GET api/bu
// @desc    Return all bu 
// @access  Private

router.get('/:startDate/:endDate', (req, res) => {
    const startDate = req.params.startDate;
    const endDate = req.params.endDate;
    console.log(startDate,endDate)
    Inventory.find({expiry_date:{
        $gte:startDate,
        $lt:endDate
    }},(err, inventory) => {
        res.send(inventory);
    }).catch(err => {
        res.status(400).send("No Bu Exists !");
    });
});

// @route   DELETE api/bu/:productId
// @desc    Delete a  bu
// @access  Private

router.delete('/:InventoryId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.InventoryId)) {
        Inventory.deleteOne({ _id: req.params.InventoryId }, (err, inventory) => {
            if (err) throw err;
            res.send(inventory)
        })
            .catch(err => {
                res.status(400).send(err);
            })
    } else res.send("ID NOT FOUND")
});


module.exports = router;

router.post('/import', function (req, res, next) {
    var region = req.body;
    region.forEach(element => {
        let newInventory = new Inventory({
            batch_no: element.batch_number,
            expiry_date: element.expiry_date,
            quantity: element.quantity,
            region: element.region,
            sku_id: element.sku_id,
            sku: element.sku
        });
        newInventory.save()
            .then(BU => {
            })
            .catch(err => console.log(err));
    });
})
