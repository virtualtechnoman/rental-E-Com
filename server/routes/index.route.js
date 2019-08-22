const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const productRoutes = require('./products.route');
// const therapyRoutes = require('./therapy.route');
// const buRoutes = require('./bu.route');
const orderRoutes = require("./order.route");
const returnOrderRoutes = require("./return.order.route");
const userRoleRoutes = require('./user_roles.route');
const challanRoutes = require("./challan.route");
const vehicleRoutes = require("./vehicle.route");
const driverRoutes = require("./driver.route");
const customerRoutes = require("./customer.route");
const productCategoryRoutes = require("./product.category.route");
const cartRoutes = require("./cart.route");
const customerOrderRoutes = require("./customer.order.route");
const stateRoutes = require("./state.route");
const cityRoutes = require("./city.route");
const areaRoutes = require("./area.route");
const orderStatusRoutes = require("./orderstatus.route");
const authMiddleware = require("../middleware/authMiddleware");
const validateEnv = require("../middleware/validateEnv");
const router = express.Router();

/** GET /health-check - Check service health */

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', validateEnv, authRoutes);
router.use('/user', validateEnv, authMiddleware, userRoutes);
router.use('/state', validateEnv, authMiddleware, stateRoutes);
router.use('/city', validateEnv, authMiddleware, cityRoutes);
router.use('/area', validateEnv, authMiddleware, areaRoutes);
router.use('/products', validateEnv, authMiddleware, productRoutes);
router.use("/order", validateEnv, authMiddleware, orderRoutes);
router.use("/orderstatus", authMiddleware, orderStatusRoutes);
router.use("/rorder", validateEnv, authMiddleware, returnOrderRoutes);
router.use('/challan', validateEnv, authMiddleware, challanRoutes);
router.use('/role', userRoleRoutes);
router.use('/driver', validateEnv, authMiddleware, driverRoutes);
router.use('/customer', validateEnv, authMiddleware, customerRoutes);
router.use('/pcategory', validateEnv, authMiddleware, productCategoryRoutes);
router.use('/cart', validateEnv, authMiddleware, cartRoutes);
router.use('/corder', validateEnv, authMiddleware, customerOrderRoutes);
router.use('/vehicle', validateEnv, authMiddleware, vehicleRoutes);

module.exports = router;
