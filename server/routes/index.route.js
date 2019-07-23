const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const productRoutes = require('./products.route');
const therapyRoutes = require('./therapy.route');
const buRoutes = require('./bu.route');
const userRoleRoutes = require('./user_roles.route');
const cityRoutes = require('./city.route');
const regionRoutes = require('./region.route');
const districtRoutes = require('./district.route');
const inventoryRoutes = require('./inventory.route');
const customerRoutes = require('./customer.route');
const customertypeRoutes = require('./customer_type.route');
const countryRoutes = require('./country.route');
const companyRoutes = require('./company.route');
const distirbutorsRoutes = require('./distirbutor.route');
const salesRoutes = require('./sales.route');
const targetRoutes = require('./target.route');
const incentiveshareRoutes = require('./incentive.route');
const incentivePeriodRoutes = require('./incentiveperiod.route');
const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) =>
  res.send('OK')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);


router.use('/bu', buRoutes);
router.use('/city', cityRoutes);
router.use('/company', customertypeRoutes);
router.use('/country', countryRoutes);
router.use('/customer', customerRoutes);
router.use('/customertype', customertypeRoutes);
router.use('/district', districtRoutes);
router.use('/distirbutors', distirbutorsRoutes);
router.use('/incentiveshare', incentiveshareRoutes);
router.use('/incentiveperiod', incentivePeriodRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/products', productRoutes);
router.use('/region', regionRoutes);
router.use('/sales', salesRoutes);
router.use('/target', targetRoutes);
router.use('/therapy', therapyRoutes);
router.use('/userrole', userRoleRoutes);

module.exports = router;
