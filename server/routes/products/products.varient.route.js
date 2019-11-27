const express = require('express');
const router = express.Router();
const ProductVarient = require('../../models/products/product.varient.model');
const ProductVarientController = require('../../controllers/product/product.varient.controller');
const isEmpty = require('../../utils/is-empty');
const mongodb = require('mongoose').VARIENTSs;
const authorizePrivilege = require("../../middleware/authorizationMiddleware");
9711596765
//  *************** GET APIS *********************** //
// GET ALL PRODUCT VARIENTS
router.get("/all", authorizePrivilege("GET_ALL_PRODUCT_VARIENTS"), (req, res) => {
    ProductVarient
        .find()
        .populate('attributes.value product')
        .exec()
        .then(docs => {
            if (docs.length > 0)
                res.json({ status: 200, data: docs, errors: false, message: "All PRODUCT VARIENTS" });
            else
                res.json({ status: 200, data: docs, errors: false, message: "NO PRODUCT VARIENTS FOUND" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, data: null, errors: true, message: "ERROR WHILE GETTING PRODUCT VARIENTS" })
        })
})

// GET SPECIFIC PRODUCT VARIENTS 
router.get("/VARIENTS/:id", authorizePrivilege("GET_ALL_PRODUCT_VARIENTS"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        ProductVarient
            .findById(req.params.id)
            .exec()
            .then(docs => {
                if (docs.length > 0)
                    res.json({ status: 200, data: docs, errors: false, message: "ALL PRODUCT VARIENTS " });
                else
                    res.json({ status: 200, data: docs, errors: true, message: "NO PRODUCT VARIENTS FOUND" });
            }).catch(err => {
                res.status(500).json({ status: 500, data: null, errors: true, message: "ERROR WHILE FETCHING PRODUCT VARIENTS" });
            })
    } else {
        res.status(500).json({ status: 404, data: null, errors: true, message: "INVALID ID" })
    }
})

// ************************* POST API ***********************
// ADD NEW PRODUCT CATEGORY
router.post('/add', authorizePrivilege("ADD_NEW_PRODUCT_VARIENTS"), async(req, res) => {
    let result = ProductVarientController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "FIELDS REQUIRED" });
    }
    let newProductVARIENTS = new ProductVarient(result.data);
    newProductVARIENTS
        .save()
        .then((_ProductVARIENTS) => {
            _ProductVARIENTS.populate({ path: "attributes" })
            res.json({ status: 200, data: _ProductVARIENTS, errors: false, message: "NEW PRODUCTVARIENT ADDED SUCCESSFULLY " });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, data: null, errors: true, message: "PRODUCTVARIENTS ADDED BUT ERROR OCCURED WHILE POPULATING FIELDS" });
        })
});

//UPDATE A PRODUCT
router.put("update/:id", authorizePrivilege("UPDATE_PRODUCT_VARIENTS"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = ProductVarientController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        ProductVarient.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
            if (err)
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating ProductVARIENTS" });
            else {
                return res.status(200).json({ status: 200, data: doc, errors: false, message: "ProductVARIENTS Updated Successfully" });
            }
        })
    } else {
        res.json({ status: 200, data: null, errors: true, message: "Invalid ProductVARIENTS id" });
    }
})

// DELETE AN ProductVARIENTS
router.delete("/delete/:id", authorizePrivilege("DELETE_PRODUCT_VARIENTS"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid category id" });
    } else {
        ProductVarient.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the category" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Category deleted successfully!" });
            }
        })
    }
})

module.exports = router;