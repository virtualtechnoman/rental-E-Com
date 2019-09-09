const express = require('express');
const router = express.Router();
const Attribute = require('../models/product.category.attribute.model');
const AttributeController = require('../controllers/product.category.attribute.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;
const authorizePrivilege = require("../middleware/authorizationMiddleware");

//GET ALL CATEGORY CREATED BY SELF
// router.get("/",authorizePrivilege("GET_ALL_PRODUCTS_OWN"), (req, res) => {
//     ProductCategory.find({created_by:req.user._id}).populate("created_by","-password").exec().then(docs => {
//         if (docs.length > 0)
//             res.json({ status: 200, data: docs, errors: false, message: "All products" });
//         else
//             res.json({ status: 200, data: docs, errors: true, message: "No products found" });
//     }).catch(err => {
//         res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting products" })
//     })
// })

// GET ALL PRODUCT CATEGORY
// router.get("/all", authorizePrivilege("GET_ALL_PRODUCT_CATEGORY"), (req, res) => {
//     Attribute.find().exec().then(docs => {
//         if (docs.length > 0)
//             res.json({ status: 200, data: docs, errors: false, message: "All categories" });
//         else
//             res.json({ status: 200, data: docs, errors: true, message: "No categories found" });
//     }).catch(err => {
//         res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting categories" })
//     })
// })

// GET ALL ATTRIBUTES OF PRODUCT CATEGORY
router.get("/category/:id", authorizePrivilege("GET_CATEGORY_ATTRIBUTE"), (req, res) => {
    Attribute.find({category:req.params.id}).exec().then(docs => {
        if (docs.length > 0)
            res.json({ status: 200, data: docs, errors: false, message: "All atrributes for given category" });
        else
            res.json({ status: 200, data: docs, errors: true, message: "No attribute found for the given category" });
    }).catch(err => {
        res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting attributes for category" })
    })
})


// ADD NEW PRODUCT CATEGORY
router.post('/', authorizePrivilege("ADD_NEW_PRODUCT_CATEGORY_ATTRIBUTE"), async (req, res) => {
    let result = AttributeController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
    }
    let newAttribute = new Attribute(result.data);
    newAttribute
        .save()
        .then(attribute => {
            res.json({ status: 200, data: attribute, errors: false, message: "Attribute added successfully" })
        })
        .catch(err => {
            console.log(err);
            res.json({ status: 500, data: null, errors: true, message: "Error while creating new attribute" });
        });
});

//UPDATE A PRODUCT
router.put("/:id", authorizePrivilege("UPDATE_PRODUCT_CATEGORY_ATTRIBUTE"), (req, res) => {
    if (mongodb.ObjectId.isValid(req.params.id)) {
        let result = AttributeController.verifyUpdate(req.body);
        if (!isEmpty(result.errors)) {
            return res.status(400).json({ status: 400, data: null, errors: result.errors, message: "Fields Required" });
        }
        Attribute.findByIdAndUpdate(req.params.id, {$set:result.data}, { new: true }, (err, doc) => {
            if (err)
                return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while updating attribute" });
            else {
                return res.status(200).json({ status: 200, data: doc, errors: false, message: "Attribute Updated Successfully" });
            }
        })
    }
    else {
        res.json({ status: 200, data: null, errors: true, message: "Invalid attribute id" });
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

//DELETE A PRODUCT CATEGORY
// router.delete("/:id", authorizePrivilege("DELETE_PRODUCT_CATEGORY"), (req, res) => {
//     if (!mongodb.ObjectId.isValid(req.params.id)) {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid category id" });
//     }
//     else {
//         Attribute.findByIdAndDelete(req.params.id, (err, doc) => {
//             if (err) {
//                 return res.status(500).json({ status: 500, data: null, errors: true, message: "Error while deleting the category" })
//             }
//             if (doc) {
//                 res.json({ status: 200, data: doc, errors: false, message: "Category deleted successfully!" });
//             }
//         })
//     }
// })

// // GET SPECIFIC PRODUCT CATEGORY
// router.get("/id/:id", authorizePrivilege("GET_PRODUCT_CATEGORY"), (req, res) => {
//     if (mongodb.ObjectId.isValid(req.params.id)) {
//         Attribute.findById(req.params.id).exec().then(doc => {
//             res.json({ status: 200, data: doc, errors: false, message: "Category" });
//         }).catch(e => {
//             console.log(e);
//             res.status(500).json({ status: 500, data: null, errors: true, message: "Error while getting the category" })
//         });
//     } else {
//         res.status(400).json({ status: 400, data: null, errors: true, message: "Invalid category id" });
//     }
// });
module.exports = router;


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
