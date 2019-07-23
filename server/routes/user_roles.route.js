const express = require('express');
const router = express.Router();
const userRole = require('../models/userRole.model');
const userroleCtrl = require('.././controllers/userrole.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongodb');


// @route   GET api/userrole
// @desc    Return all userRoles
// @access  Private
router.post(
    '/',
    (req, res) => {
        let user_role = new userRole(req.body);
        user_role
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
    }
);

router.put('/:userId', (req, res) => {
    if (mongodb.ObjectID.isValid(req.params.userId)) {
        let result = userroleCtrl.insert(req.body);
        if (!isEmpty(result.errors)) {
            res.status(400).json(result.errors);
        }
        User_Role.findByIdAndUpdate(req.params.userId, result.data, { new: true }, function (err, user) {
            if (!user)
                res.status(404).send("data is not found");
            else
                res.send(user);
        });
    }
});

router.get('/', (req, res) => {
    User_Role.find((err, user_role) => {
        res.send(user_role);
    })
        .catch(err => {
            res.status(400).send("Update not possible");
        });
}
);

router.delete('/:roleId', (req, res) => {
    User_Role.remove({ _id: req.params.roleId }, (err, user) => {
        if (err) throw err;
        res.send(user)
    })
        .catch(err => {
            res.status(400).send(err);
        });
}
);


module.exports = router;

router.post('/import', function (req, res, next) {
    var userRole = req.body;
    res.send({ res: "started" })
    userRole.forEach(element => {
        randomNumber = Math.round(Math.random() * (999 - 1) + 1);
        var id = "CUS" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
        console.log("Element DATA===>>" + id, element.bu_name, element.is_active.toLowerCase());
        let newuserRole = new userRole({
            bu_name: element.user_role.toLowerCase(),
            can_access_bu: element.can_access_bu.toLowerCase(),
            can_access_city: element.can_access_city.toLowerCase(),
            can_access_country: element.can_access_country.toLowerCase(),
            can_access_customer: element.can_access_customer.toLowerCase(),
            can_access_customer_type: element.can_access_customer_type.toLowerCase(),
            can_access_district: element.can_access_district.toLowerCase(),
            can_access_products: element.can_access_products.toLowerCase(),
            can_access_region: element.can_access_region.toLowerCase(),
            can_access_therapy: element.can_access_therapy.toLowerCase(),
            can_access_users: element.can_access_users.toLowerCase()
        });
        console.log("RESULT NEW BU ------>" + newBU)
        newuserRole.save()
            .then(BU => {
                res.send(BU);
            })
            .catch(err => console.log(err));
    });
    res.send({ res: "DONE" })
})
