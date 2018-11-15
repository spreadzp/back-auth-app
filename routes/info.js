const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const verifyJWT_MW = require('./../middlewares/verifierJwt');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/', verifyJWT_MW, (req, res) => {
  let errors = [];
  const userData = req.user;
  res.render('info', {
    errors: errors,
    tokenUser: `Bearer ${userData.newToken}`,
    idUser: userData.idUser,
    typeId: userData.typeId
  })
});

module.exports = router;
