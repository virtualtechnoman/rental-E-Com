const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const isEmpty = require("../utils/is-empty");
const userCtrl = require('../controllers/user.controller');
const User = require('../models/user.model');
var mongodb = require("mongodb");
const moment = require('moment');
const router = express.Router();
const bcrypt = require("bcryptjs");


//router.use(passport.authenticate('jwt', { session: false }))
async function insert(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}

//GET all users
router.get('/', async (req, res) => {
  try {
    const allUsers = await User.find().populate("role").exec();
    res.json(allUsers);
  }
  catch (err) {
    res.json({ message: "Error while fetching users" });
  }
  // ,(err, users) => {
  //   if(err)
  //   res.json({message:"Error while fetching users"})
  //   else{
  //     res.json(users);
  //   }
  // });
})

// GET all users by role
router.post('/role', async (req, res) => {
  console.log(req.body.role)
  if (mongodb.ObjectId.isValid(req.body.role)) {
    try {
      const allUsers = await User.find({ role: req.body.role }).populate("role").exec()
      res.json(allUsers);
    } catch (err) {
      console.log(err)
      res.json({ message: "Error while searching for users associated with this role" })
    }

    //    (err, user) => {
    //   if (err)
    //     return res.status(500).send({ message: "Error while searching for users associated with this role" });
    //   if (user.length > 0) {
    //     user.populate('role', (err, populateduser) => {
    //       res.send(populateduser);
    //     })
    //   }
    //   else if (user) {
    //     res.status(404).send({ message: "no user found with this role" })
    //   }
    // })
  } else {
    res.json({ message: "Invald role" })
  }
})

// DELETE a user
router.delete('/', (req, res) => {
  if (mongodb.ObjectID.isValid(req.body.id)) {
    User.deleteOne({ _id: req.body.id }, (err, user) => {
      if (err) throw err;
      res.send(user)
    }).catch(err => {
      res.status(400).send(err);
    });
  } else {
    Console.log("ID not Found")
  }
});


// UPDATE A USER
router.put('/', (req, res) => {
  if (mongodb.ObjectID.isValid(req.body.id)) {
    let user = (({ full_name, email, role }) => ({ full_name, email, role }))(req.body);
    console.log(user);
    //   console.log("Body", req.body);
    //   console.log("REULS --->", result.data)
    User.findByIdAndUpdate(req.body.id, user, { new: true }, (err, doc) => {
      if (!doc)
        res.status(404).send("Data not found");
      else {
        console.log("Updated User", doc.getPublicFields());
        res.send(doc.getPublicFields());
      }
    }).catch(err => console.log(err))
  } else {
    return res.status(404).send("ID NOT FOUND");
  }
})

// ADD NEW USER
router.post("/", (req, res) => {
  // let result = userCtrl.insert(req.body);


  let user = (({ full_name, email, password, role }) => ({ full_name, email, password, role }))(req.body);
  let result = userCtrl.insert(req.body)
  if (isEmpty(result.errors)) {
    user.user_id = "USR" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
    // console.log(user);
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        user.password = hash;
        const newuser = new User(user);
        newuser.save().then(data => {
          res.status(200).json(data.getPublicFields());
        }).catch(err => {
          res.status(500).json({ message: "Error while creating new user" });
        })
      });
    });
  }
  else {
    res.json(result.errors);
  }
})


module.exports = router;
