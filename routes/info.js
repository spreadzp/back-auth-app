const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ensureAuthenticated } = require('../helpers/auth');
const config = require('../config/secret'); // get config file

// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/', ensureAuthenticated, (req, res) => {
  let errors = [];
  const userData = req.user._doc;
  console.log('userData :', userData);
  // if user is found and password is valid
  // create a token
  const token = jwt.sign({
    id: userData._id
  }, config.secret, {
    expiresIn: 600 // expires in 10 min
  });
  console.log('token :', token);
  res.render('info', {
    errors: errors,
    idUser: userData.idUser,
    typeId: userData.typeId
  })
});

module.exports = router;