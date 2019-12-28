const router = require("express").Router();
const productRoutes = require('../products/products.route');
const productCategoryRoutes = require("../products/product.category.route");
const productAttributeRoutes = require("../products/product.attribute.route");
const productTypeRoute = require("../products/product.type.route");
const brandRoutes = require("../products/brand.route");
const productOption = require("../products/product.options.route");
const productVarients = require("../products/products.varient.route");

router.use('/pcategory', productCategoryRoutes);
router.use('/products', productRoutes);
router.use('/pattribute', productAttributeRoutes);
router.use('/ptype', productTypeRoute);
router.use('/brand', brandRoutes);
router.use('/poptions', productOption);
router.use('/pvarients', productVarients);

module.exports = router;