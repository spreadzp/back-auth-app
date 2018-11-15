const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const router = express.Router();
var Redis = require('ioredis');
var redis = new Redis({
  port: 6379, // Redis port
  host: '127.0.0.1', // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: 'auth',
  db: 0
})
var JWTR = require('jwt-redis');
var jwtr = new JWTR(redis);

require('dotenv').config();
const verifyJWT_MW = require('./../middlewares/verifierJwt');
const tokenSecret = process.env.TOKEN_SECRET || 'some other secret as default';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'some refresh secret as default';
const tokenLife = +process.env.TOKEN_LIFE || 600;

// Load User Model
require('../models/User');
const User = mongoose.model('users');

// User Login Route
router.get('/signin', (req, res) => {
  res.render('users/signin');
});

// User Register Route
router.get('/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/signin', (req, res) => {
  console.log('req.body :', req.body);
  const errors = {};
  const userId = req.body.idUser;
  const password = req.body.password;
  console.log(req.body);
  User.findOne({
      idUser: userId
    })
    .then(user => {
      if (!user) {
        errors.userId = "No Account Found";
        return res.status(404).json(errors);
      }
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            const payload = {
              idUser: user.idUser,
              typeId: user.typeId,
              password: user.password
            };

            jwtr.sign(payload, tokenSecret, {
                expiresIn: tokenLife
              },
              (err, token) => {
                if (err) {
                  res.status(500)
                    .json({
                      error: "Error signing token",
                      raw: err
                    });
                }
                const response = {
                  errors: errors,
                  idUser: user.idUser,
                  typeId: user.typeId,
                  tokenUser: `Bearer ${token}`,
                  status: "Logged in"
                }
                res.render('info', response);
              });
          } else {
            errors.password = "Password is incorrect";
            res.status(400).json(errors);
          }
        });
    });
});


// Register Form POST
router.post('/signup', (req, res) => {
  console.log('?????', req.body);
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({
      text: 'Passwords do not match'
    });
  }

  if (req.body.password.length < 4) {
    errors.push({
      text: 'Password must be at least 4 characters'
    });
  }

  if (errors.length > 0) {
    res.render('users/signup', {
      errors: errors,
      idUser: req.body.idUser,
      typeId: req.body.typeUserId,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({
        idUser: req.body.idUser
      })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email already regsitered');
          res.redirect('/users/signup');
        } else {
          const newUser = new User({
            idUser: req.body.idUser,
            typeId: req.body.typeUserId,
            password: req.body.password
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/signin');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

// Logout User
router.get('/logout', verifyJWT_MW, (req, res) => {
  //req.logout();
  const tokenLogout = req.user.prewToken;
  console.log('tokenLogout :', tokenLogout);
  jwtr.destroy(tokenLogout, (err, decode) => {
    if (err) {
      res.status(500)
        .json({
          error: "Error signing token",
          raw: err
        });
    }
    console.log('decode :', decode);
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/signin');
  })

});

module.exports = router;