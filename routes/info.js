const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ensureAuthenticated } = require('../helpers/auth');
// const config = require('../config/secret'); // get config file
require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET || 'some other secret as default';
const verifyJWT_MW = require('./../middlewares/verifierJwt');

// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/', verifyJWT_MW, (req, res) => {
  // 
  // const newToken = checkAndUpdateToken(req);
  let errors = [];
  const userData = req.user;
  console.log('rereq :',req);
  // if user is found and password is valid
  // create a token
/*   const token = jwt.sign({
    id: userData._id
  }, tokenSecret, {
    expiresIn: 600 // expires in 10 min
  }); */
  // console.log('token :', token);
  res.render('info', {
    errors: errors,
    idUser: userData.idUser,
    typeId: userData.typeId
  })
});

checkAndUpdateToken = (req) => {
  const postData = req.body
  // if refresh token exists
  if ((postData.refreshToken) && (postData.refreshToken in tokenList)) {
    const user = {
      "email": postData.email,
      "name": postData.name
    }
    const token = jwt.sign(user, config.secret, {
      expiresIn: config.tokenLife
    })
    const response = {
      "token": token,
    }
    // update the token in the list
    tokenList[postData.refreshToken].token = token;
    return response;
  }
}

module.exports = router;