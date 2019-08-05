const express = require('express');
const isEmpty = require("../utils/is-empty");
const userCtrl = require('../controllers/user.controller');
const User = require('../models/user.model');
var mongodb = require("mongodb");
const moment = require('moment');
const router = express.Router();
const bcrypt = require("bcryptjs");


//GET all users
router.get('/', async (req, res) => {
  try {
    const allUsers = await User.find().populate("role").exec();
    res.json(allUsers);
  }
  catch (err) {
    res.json({ message: "Error while fetching users" });
  }
})

// GET all users by role
router.get('/role/:role', async (req, res) => {
    try {
      const allUsers = await User.find({ role: req.params.role }).populate("role").exec()
      res.json(allUsers);
    } catch (err) {
      res.json({ message: "Error while searching for users associated with this role" })
    }
})

// DELETE a user
router.delete('/:id', (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    User.deleteOne({ _id: req.params.id }, (err, user) => {
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
router.put('/:id', (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    // let user = (({ full_name, email, role }) => ({ full_name, email, role }))(req.body);
    const result = userCtrl.verifyUpdate(req.body);
    if(!isEmpty(result.errors)){
      return res.json(result.errors)
    }
    User.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, doc) => {
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


  // let user = (({ full_name, email, password, role }) => ({ full_name, email, password, role }))(req.body);
  let result = userCtrl.verifyCreate(req.body)
  if (isEmpty(result.errors)) {
    User.findOne({email:result.data.email},(err,doc)=>{
      if(err)
      return res.status(500).json({message:})
    })
    result.data.user_id = "USR" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + Math.floor(Math.random() * (99 - 10) + 10);
    // console.log(user);
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(result.data.password, salt, function (err, hash) {
        result.data.password = hash;
        const newuser = new User(result.data);
        newuser.save().then(data => {
          res.status(200).json(data.getPublicFields());
        }).catch(err => {
          res.status(500).json({ message: "Error while creating new user" });
        })
      });
    });
  }
  else{
    res.json(result.errors);
  }
})


module.exports = router;
