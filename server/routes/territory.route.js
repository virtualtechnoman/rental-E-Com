const express = require('express');
const router = express.Router();
const City = require('../models/city.model');
const Company = require('../models/company.model');
const Country = require('../models/country.model');
const District = require('../models/district.model');
const Region = require('../models/region.model');

const mongodb = require('mongodb');

// @route   POST api/therapys/add
// @desc    Add Therapy
// @access  Private

router.post('/', (req, res) => {
    const newCompany = new Company(req.body.company)
    newCompany.save().then(company => {

        const newCountry = new Country({ ...req.body.country, ...{ company_id: company._id } })
        newCountry.save().then(country => {
            const newRegion = new Region({ ...req.body.region, ...{ country_id: country._id } })
            newRegion.save().then(region => {
                const newCity = new City({ ...req.body.city, ...{ region_id: region._id } })
                newCity.save().then(city => {
                    const newDistrict = new District({ ...req.body.district, ...{ city_id: city._id } })
                    newDistrict.save().then(data => res.send({ success: true }))
                })

            })
        })
    })
});




module.exports = router;
