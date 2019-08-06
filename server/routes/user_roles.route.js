const express = require('express');
const router = express.Router();
const userRole = require('../models/userRole.model');
const UserRoleController = require('.././controllers/userrole.controller');
const isEmpty = require('../utils/is-empty');
const mongodb = require('mongoose').Types;


// @route   GET api/userrole
// @desc    Return all userRoles
// @access  Private

//GET ALL ROLES
router.get("/", (req, res) => {
    userRole.find().exec().then(data => {
        res.status(200).json({status:200,message:"All users", errors:false,data});
    }).catch(err => {
        console.log(err);
        res.status(500).json({ status:500, data:null, errors:true, message: "Error while fetching the user roles" });
    })
})


//ADD New Role
router.post('/', (req, res) => {
    let result = UserRoleController.verifyCreate(req.body);
    if (!isEmpty(result.errors)) {
        return res.status(200).json({ status: 200, message:"Fields required", errors: result.errors, data: null })
    }
    let role = new userRole(result.data);
    role.save().then(Role => res.status(200).json({ status: 200, message:"Role added successfully", errors: false, data: Role })).catch(err => {
        console.log(err)
        res.json({ status: 500, message:"Error while adding role", errors: true, data: null })
    });
}
);


//Update a role
router.put("/", (req, res) => {
    if (mongodb.ObjectId.isValid(req.body.id)) {
        let role = (({ name }) => ({ name }))(req.body);
        userRole.findByIdAndUpdate(req.body.id, role, { new: true }, (err, doc) => {
            if (err) {
                console.log(err);
                res.status(500).json({status:500,errors:true, data:null, message: "Error while updating the role" })
            }
            if (doc) {
                res.status(200).json({status:200,errors:false, data:doc, message: "Role updated successfully" })
            }
        })
    }
    else {
        res.json({status:400, message: "Invalid role id",errors:false, data:null })
    }
})

// Delete a role
router.delete("/", (req, res) => {
    if (mongodb.ObjectId.isValid(req.body.id)) {
        userRole.deleteOne({ _id: req.body.id }, (err, doc) => {
            if (err)
                res.json({ status:500, errors:true, data:null, message: "Error while deleting the role" })
            if (doc)
                res.json(doc);
        })
    } else {
        res.json({ status:400, errors:false, data:null, message: "Invalid data" });
    }
})

// router.put('/:userId', (req, res) => {
//     if (mongodb.ObjectId.isValid(req.params.userId)) {
//         let result = userroleCtrl.insert(req.body);
//         if (!isEmpty(result.errors)) {
//             res.status(400).json(result.errors);
//         }
//         User_Role.findByIdAndUpdate(req.params.userId, result.data, { new: true }, function (err, user) {
//             if (!user)
//                 res.status(404).send("data is not found");
//             else
//                 res.send(user);
//         });
//     }
// });

// router.get('/', (req, res) => {
//     User_Role.find((err, user_role) => {
//         res.send(user_role);
//     })
//         .catch(err => {
//             res.status(400).send("Update not possible");
//         });
// }
// );

// router.delete('/:roleId', (req, res) => {
//     User_Role.remove({ _id: req.params.roleId }, (err, user) => {
//         if (err) throw err;
//         res.send(user)
//     })
//         .catch(err => {
//             res.status(400).send(err);
//         });
// }
// );


module.exports = router;

// router.post('/import', function (req, res, next) {
//     var userRole = req.body;
//     res.send({ res: "started" })
//     userRole.forEach(element => {
//         randomNumber = Math.round(Math.random() * (999 - 1) + 1);
//         var id = "CUS" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
//         console.log("Element DATA===>>" + id, element.bu_name, element.is_active.toLowerCase());
//         let newuserRole = new userRole({
//             bu_name: element.user_role.toLowerCase(),
//             can_access_bu: element.can_access_bu.toLowerCase(),
//             can_access_city: element.can_access_city.toLowerCase(),
//             can_access_country: element.can_access_country.toLowerCase(),
//             can_access_customer: element.can_access_customer.toLowerCase(),
//             can_access_customer_type: element.can_access_customer_type.toLowerCase(),
//             can_access_district: element.can_access_district.toLowerCase(),
//             can_access_products: element.can_access_products.toLowerCase(),
//             can_access_region: element.can_access_region.toLowerCase(),
//             can_access_therapy: element.can_access_therapy.toLowerCase(),
//             can_access_users: element.can_access_users.toLowerCase()
//         });
//         console.log("RESULT NEW BU ------>" + newBU)
//         newuserRole.save()
//             .then(BU => {
//                 res.send(BU);
//             })
//             .catch(err => console.log(err));
//     });
//     res.send({ res: "DONE" })
// })
