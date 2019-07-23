const express = require('express');
const router = express.Router();
const Product = require('../models/Products.model');
const productCtrl = require('.././controllers/products.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');
const moment = require('moment');
// @route   POST api/products/add
// @desc    Add Product
// @access  Private

router.post('/', async (req, res) => {
    let result = productCtrl.insert(req.body);
    if (!isEmpty(result.errors)) {
        res.status(400).json(result.errors);
    }
    let newProduct = new Product(result.data);
    newProduct
        .save()
        .then(product => res.json(product))
        .catch(err => console.log(err));
}
);


// @route   PUT api/users/update/:id
// @desc    Return current user
// @access  Private

router.put('/:productId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.productId)) {
        let result = productCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        Product.findByIdAndUpdate(req.params.productId, result.data, { new: true }, function (err, product) {
            if (!product)
                res.status(404).send("data is not found");
            else
                res.send(product);
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    } else {
        res.send("ID NOT FOUND")
    }
});


// @route   GET api/products
// @desc    Return all users
// @access  Private
router.get('/', (req, res) => {
    Product.find((err, product) => {
        res.send(product);
    })
        .catch(err => {
            res.status(400).send("No Products Exists !");
        });
}
);

// @route   DELETE api/products/delete/:productId
// @desc    Delete a  Product
// @access  Private
router.delete('/:productId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.productId)) {
        Product.deleteOne({ _id: req.params.productId }, (err, product) => {
            if (err) throw err;
            res.json({ success: true, message: "Product is deleted successfully" })
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
    var product = req.body;
    product.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "PROD" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        let newProduct = new Product({
            brand: element.brand,
            sku_id: id,
            is_active: element.is_active.toLowerCase(),
            cif_price: element.cif_price,
            business_unit: element.business_unit,
            business_unit_id: element.business_unit_id,
            distirbutor: element.distirbutor,
            form: element.form,
            notes: element.notes,
            pack_size: element.pack_size,
            promoted: element.promoted.toLowerCase(),
            registered: element.registered.toLowerCase(),
            range: element.range,
            strength: element.strength,
            therapy_line: element.therapy_line,
            therapy_line_id: element.therapy_line_id,
            whole_price: element.whole_price,
            sku_id: element.sku_id
        });
        newProduct.save()
            .then(BU => {
                res.send(BU);
            })
            .catch(err => console.log(err));
    });
    res.send({ res: "DONE" })
})
