const express = require('express');
const router = express.Router();
const ProductType = require('../../models/products/products.type.model');
const ProductTypeController = require('../../controllers/product/product.type.model');
const isEmpty = require('../../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../../middleware/authorizationMiddleware");

//  *************** GET APIS *********************** //
// GET ALL PRODUCT TYPE
router.get("/all", authorizePrivilege("GET_ALL_PRODUCT_TYPE"), (req, res) => {
    ProductType
        .find()
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

// GET SPECIFIC PRODUCT TYPE 
router.get("/type/:id", authorizePrivilege("GET_ALL_PRODUCT_TYPE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        ProductType
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
})

// ************************* POST API ***********************
// ADD NEW PRODUCT CATEGORY
router.post('/add', authorizePrivilege("ADD_NEW_PRODUCT_TYPE"), async (req, res) => {
    let result = ProductTypeController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newProductType = new ProductType(result.data);
    newProductType
        .save()
        .then((_ProductType) => {
            res.json({ status: 200, data: _ProductType, errors: false, message: "New ProductType added successfully" });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ status: 500, data: null, errors: true, message: "ProductType added but error occured while populating fields" });
        })
});

//UPDATE A PRODUCT
router.put("update/:id", authorizePrivilege("UPDATE_PRODUCT_TYPE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = ProductTypeController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        ProductType.findByIdAndUpdate(req.params.id, { $set: result.data }, { new: true }, (err, doc) => {
            if (err)
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating ProductType" });
            else {
                return res.status(200).json({ status: 200, data: doc, errors: false, message: "ProductType Updated Successfully" });
            }
        })
    }
    else {
        res.json({ status: 200, data: null, errors: true, message: "Invalid ProductType id" });
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

// DELETE AN ProductType
router.delete("/delete/:id", authorizePrivilege("DELETE_PRODUCT_TYPE"), (req, res) => {
    if (!mongodb.ObjectId.isValid(req.params.id)) {
        res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid category id" });
    }
    else {
        ProductType.findByIdAndDelete(req.params.id, (err, doc) => {
            if (err) {
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the category" })
            }
            if (doc) {
                res.json({ status: 200, data: doc, errors: false, message: "Category deleted successfully!" });
            }
        })
    }
})

// // GET SPECIFIC PRODUCT CATEGORY
// router.get("/id/:id", authorizePrivilege("GET_PRODUCT_CATEGORY"), (req, res) => {
//     if (mongodb.ObjectId.isValid(req.params.id)) {
//         ProductType.findById(req.params.id).exec().then(doc => {
//             res.json({ status: 200, data: doc, errors: false, message: "Category" });
//         }).catch(e => {
//             console.log(e);
//             res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting the category" })
//         });
//     } else {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid category id" });
//     }
// });


// router.post('/import', function (req, res, next) {
//     var product = req.body;
//     product.forEach(element => {
//         randomNumber = Math.round(Math.random() * (999 - 1) + 1);
//         var id = "PROD" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
//         let newProduct = new Product({
//             brand: element.brand,
//             sku_id: id,
//             is_active: element.is_active.toLowerCase(),
//             cif_price: element.cif_price,
//             business_unit: element.business_unit,
//             business_unit_id: element.business_unit_id,
//             distirbutor: element.distirbutor,
//             form: element.form,
//             notes: element.notes,
//             pack_size: element.pack_size,
//             promoted: element.promoted.toLowerCase(),
//             registered: element.registered.toLowerCase(),
//             range: element.range,
//             strength: element.strength,
//             therapy_line: element.therapy_line,
//             therapy_line_id: element.therapy_line_id,
//             whole_price: element.whole_price,
//             sku_id: element.sku_id
//         });
//         newProduct.save()
//             .then(BU => {
//                 res.send(BU);
//             })
//             .catch(err => console.log(err));
//     });
//     res.send({ res: "DONE" })
// })


module.exports = router;
