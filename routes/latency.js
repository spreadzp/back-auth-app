const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    ensureAuthenticated
} = require('../helpers/auth');
// const config = require('../config/secret'); // get config file
require('dotenv').config();
var ping = require('ping');


const tokenSecret = process.env.TOKEN_SECRET || 'some other secret as default';


// Load User Model
require('../models/User');
const User = mongoose.model('users');

router.get('/', (req, res) => {
    //const newToken = checkAndUpdateToken(req);
    let errors = [];
    //const userData = req.user._doc; 
    // if user is found and password is valid
    // create a token
    /*  const token = jwt.sign({
       id: userData._i
     }, tokenSecret, {
       expiresIn: 600 // expires in 10 min
     });
     console.log('token :', token); */
    var token = req.headers;
    console.log('token :', token);
    var host = 'google.com';
    //hosts.forEach(function (host) {
    ping.promise.probe(host)
        .then(function (resPing) {
            res.render('latency', {
                errors: errors,
                host: resPing.host,
                numeric_host: resPing.numeric_host,
                latency: resPing.avg
            })
        });
});

module.exports = router;