const express = require('express');
const router = express.Router();
const verifyJWT_MW = require('./../middlewares/verifierJwt');
const ping = require('ping');  

router.get('/', verifyJWT_MW, (req, res) => {
    let errors = [];
    const userData = req.user; 
    var host = 'google.com'; 
    ping.promise.probe(host)
        .then(function (resPing) {
            res.render('latency', {
                errors: errors,
                tokenUser: `Bearer ${userData.newToken}`,
                host: resPing.host,
                numeric_host: resPing.numeric_host,
                latency: resPing.avg
            })
        });
});

module.exports = router;
