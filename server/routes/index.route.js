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
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

/** GET /health-check - Check service health */

router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', authMiddleware, userRoutes);
router.use('/products', authMiddleware, productRoutes);
router.use("/order", authMiddleware, orderRoutes);
router.use("/rorder", authMiddleware, returnOrderRoutes);
router.use('/challan',authMiddleware, challanRoutes);
router.use('/role',  userRoleRoutes);
router.use('/driver', authMiddleware, driverRoutes);
router.use('/vehicle', authMiddleware, vehicleRoutes);

module.exports = router;
