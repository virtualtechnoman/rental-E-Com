const express = require('express');
// const asyncHandler = require('express-async-handler')
// const passport = require('passport');
const userCtrl = require('../controllers/user.controller');
const authCtrl = require('../controllers/auth.controller');
const config = require('../config/config');
const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const isEmpty = require('../utils/is-empty');
const helper = require('../utils/helper')
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
module.exports = router;

// router.post('/register', asyncHandler(register), login);
// router.post('/login', passport.authenticate('local', { session: false }), login);
// router.get('/me', passport.authenticate('jwt', { session: false }), login);
router.post('/register', authMiddleware);
router.post('/login', authMiddleware);
router.post('/register2', authMiddleware);
router.post('/verifyotp', authMiddleware);
router.post('/login2', authMiddleware);
router.get('/me', authMiddleware);


// async function register(req, res, next) {
//   let user = await userCtrl.insert(req.body);
//   user = user.toObject();
//   delete user.hashedPassword;
//   req.user = user;
//   next()
// }

// function login(req, res) {
//   let user = req.user;
//   let token = authCtrl.generateToken(user);
//   res.json({ user, token });
// }

router.post('/register', (req, res) => {
  let result = userCtrl.insert(req.body);
  if (!isEmpty(result.errors)) {
    res.status(400).json(result.errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      result.errors.email = 'Email already exists';
      return res.status(400).send(result.errors);
    } else {
      // delete result.data.repeatPassword
      const newUser = new User(result.data);
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});
