const express = require('express');
const passport = require('passport');
const asyncHandler = require('express-async-handler');
const userCtrl = require('../controllers/user.controller');
const User = require('../models/user.model');
var mongodb = require("mongodb");
const moment = require('moment');
const router = express.Router();


//router.use(passport.authenticate('jwt', { session: false }))
async function insert(req, res) {
  let user = await userCtrl.insert(req.body);
  res.json(user);
}

router.get('/', (req, res) => {
  User.find((err, user) => {
    res.send(user);
  })
    .populate('region', 'manager')
    .catch(err => {
      console.log(err)
    });
})

router.get('/flmId/:id', (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    User.find({ "$and": [{ manager: req.params.id }, { position: "Salesmen" }] }
      // { manager: req.params.id, position:'Salesmen' }
      , (err, user) => {
        res.send(user);
        console.log(user)
      })
      .populate('region', 'manager')
      .catch(err => {
        console.log(err)
      });
  } else {
    res.status(404).send("Id Not FOund")
  }
})

router.get('/role/:role', (req, res) => {
  // var role = String(req.params.role).toLowerCase();
  User.find({ position: req.params.role }, (err, user) => {
    console.log(user)
    res.send(user);
  })
    // .populate('region', 'manager')
    .catch(err => {
      console.log(err)
    });
})

router.get('/:id', (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    User.findById(req.params.id, (err, user) => {
      res.send(user);
    }).catch(err => {
      res.status(400).send("Get not possible");
    });
  }
  else {
    res.status(404).send("ID NOT FOUND")
  }
})

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

router.put('/:id', (req, res) => {
  if (mongodb.ObjectID.isValid(req.params.id)) {
    let result = userCtrl.insert(req.body);
    console.log("Body",req.body);
    console.log("REULS --->", result.data)
    User.findByIdAndUpdate(req.params.id, result.data, { new: true }, (err, user) => {
      if (!user)
        res.status(404).send("Data is not found");
      else {
        console.log("Updated User",user);
        res.send(user);
      }
    })
      .catch(err => console.log(err))
  } else {
    return res.status(404).send("ID NOT FOUND");
  }
})



module.exports = router;

router.post('/import', function (req, res, next) {
  var user = req.body;
  user.forEach(element => {
    randomNumber = Math.round(Math.random() * (999 - 1) + 1);
    var id = "EMP" + moment().year() + moment().month() + moment().date() + moment().hour() + moment().minute() + moment().second() + moment().milliseconds() + randomNumber;
    let newUser = new User({
    });
    console.log("RESULT NEW BU ------>" + newBU)
    newUser.save()
      .then(BU => {
        res.send(BU);
      })
      .catch(err => console.log(err));
  });
  res.send({ res: "DONE" })
})


//USERS BY REGION

router.get('/city/:id', (req, res) => {
  console.log(req.params.id)
  if (mongodb.ObjectID.isValid(req.params.id)) {
    User.find({ city: req.params.id }, (err, user) => {
      res.send(user);
    }).catch(err => {
      res.status(400).send("Get not possible");
    });
  } else
    return res.status(404).send("ID NOT FOUND");
})
