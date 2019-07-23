const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');

const isEmpty = require('../utils/is-empty');
const helper = require('../utils/helper')


// Load Admin model
const User = require('../models/user.model');
const userCtrl = require('.././controllers/user.controller');
const adminCtrl = require('.././controllers/admin.controller');


// @route   POST api/admin/register
// @desc    Register admin
// @access  Public
router.post('/register', (req, res) => {
  let result = userCtrl.insert(req.body);
  if (!isEmpty(result.errors)) {
    res.status(400).json(result.errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      result.errors.email = 'Email already exists';
      return res.status(400).json(result.errors);
    } else {
      delete result.data.repeatPassword
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

// @route   POST api/admin/login
// @desc    Login ADMIN / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {

  let result = adminCtrl.insert(req.body);
  if (!isEmpty(result.errors)) {
    res.status(400).json(result.errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      result.errors.email = 'User not found';
      return res.status(401).json(result.errors);
    } else {
      console.log("USER FOUND")
    }
    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, first_name: user.first_name, last_name: user.last_name, position: user.position }; // Create JWT Payload
        // Sign Token
        return res.status(200).json({
          user: payload,
          success: true,
          token: 'Bearer ' + helper.tokenGenerator(payload)
        });
      } else {
        result.errors.password = 'Password incorrect';
        return res.status(401).json(result.errors);
      }
    });
  });
});

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.send(req.user);
});

module.exports = router;