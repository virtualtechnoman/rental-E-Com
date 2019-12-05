const express = require('express');
const router = express.Router();
const ProductOptions = require('../../models/products/product.options.model');
const ProductAttributes = require('../../models/products/product.attribute.model');
const ProductOptionsController = require('../../controllers/product/product.options.controller');
const isEmpty = require('../../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../../middleware/authorizationMiddleware");

//  *************** GET APIS *********************** //
// GET ALL PRODUCT OPTIONS
router.get("/all", authorizePrivilege("GET_ALL_PRODUCT_TYPE"), (req, res) => {
    ProductOptions
        .find()
        .populate('attributes')
        .exec()
        .then(docs => {
            if (docs.length > 0)
                res.json({ status: 200, data: docs, errors: false, message: "All PRODUCT TYPES" });
            else
                res.json({ status: 200, data: docs, errors: false, message: "NO PRODUCT TYPE FOUND" });
        }).catch(err => {
            res.status(500).json({ status: 500, data: null, errors: true, message: "ERROR WHILE getting PRODUCT TYPE" })
        })
})

// GET SPECIFIC PRODUCT OPTIONS 
router.get("/type/:id", authorizePrivilege("GET_ALL_PRODUCT_TYPE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        ProductOptions
            .findById(req.params.id)
            .exec()
            .then(docs => {
                if (docs.length > 0)
                    res.json({ status: 200, data: docs, errors: false, message: "ALL PRODUCT TYPE " });
                else
                    res.json({ status: 200, data: docs, errors: true, message: "NO PRODUCT TYPE FOUND" });
            }).catch(err => {
                res.status(500).json({ status: 500, data: null, errors: true, message: "ERROR WHILE FETCHING PRODUCT TYPE" });
            })
    } else {
        res.status(500).json({ status: 404, data: null, errors: true, message: "INVALID ID" })
    }
});

// GET OPTIONS OF SPECIFIC ATTRBUTE 
router.post("/attribute", authorizePrivilege("GET_ALL_PRODUCT_TYPE"), (req, res) => {
    let arr = req.body.attributes;
    arr = arr && arr.length ? arr.map(e => mongodb.ObjectId(e)) : [];
    ProductAttributes.aggregate([
        { $match: { _id: { $in: arr } } },
        // { $match: { parent: mongodb.ObjectId(req.params.id) } },
        // {$group:{_id:null,}}
        { $lookup: { from: "product_options", let: { att: "$_id" }, pipeline: [{ $match: { $expr: { $eq: ["$parent", "$$att"] } } }], as: "product_option" } },
        // {$addFields:{data:["$name","$product_option"]}},
        // {$group:{_id:null,data:{$push:"$data"}}},
        // {$addFields:{data:{$arrayToObject:"$data"}}},
        // {$replaceRoot:{newRoot:"$data"}}
    ], (err, doc) => {
        if (err) { console.log(err) } 
        else {
            res.json({ status: 200, data: doc, errors: false, message: "ALL OPTIONS OF ATTRBUTE " });
        }
    })
});

// ************************* POST API ***********************
// ADD NEW PRODUCT CATEGORY
router.post('/add', authorizePrivilege("ADD_NEW_PRODUCT_TYPE"), async (req, res) => {
    let result = ProductOptionsController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newProductOptions = new ProductOptions(result.data);
    newProductOptions
        .save()
        .then((_ProductOptions) => {
            res.json({ status: 200, data: _ProductOptions, errors: false, message: "NEW PRODUCTOPTIONS ADDED SUCCESSFULLY" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, data: null, errors: true, message: "PRODUCTOPTIONS ADDED BUT ERROR OCCURED WHILE POPULATING FIELDS" });
        })
});

//UPDATE A PRODUCT
router.put("/update/:id", authorizePrivilege("UPDATE_PRODUCT_TYPE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = ProductOptionsController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        ProductOptions.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
            if (err)
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating ProductOptions" });
            else {
                return res.status(200).json({ status: 200, data: doc, errors: false, message: "ProductOptions Updated Successfully" });
            }
        })
    }
    else {
        res.json({ status: 200, data: null, errors: true, message: "Invalid ProductOptions id" });
    }
})


//GET product category for pagination
// router.get("/page/:page?", authorizePrivilege("GET_ALL_PRODUCTS"), (req, res) => {
//     let page = req.params.page || 0;
//     let limit = req.query.limit || 10;
//     limit = Number(limit);
//     let orderby = req.query.orderby || "name";
//     let order = req.query.order || 'asc';
//     let srt = {};
//     srt[orderby] = order;
//     ProductCategory.find().limit(limit).skip(limit * page).sort(srt)
//         .exec(function (err, products) {
//             if (err) {
//                 console.log(err);
//                 return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting orders" })
//             }
//             res.json({ status: 200, data: products, errors: false, message: "Products" });
//         })
// })

// DELETE AN ProductOptions
router.delete("/delete/:id", authorizePrivilege("DELETE_PRODUCT_TYPE"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid category id" });
    }
    else {
        ProductOptions.findByIdAndDelete(req.params.id, (err, doc) => {
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
