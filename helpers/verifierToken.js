const Redis = require('ioredis');
const redis = new Redis();
const JWTR = require('jwt-redis');
const jwtr = new JWTR(redis); 
require('dotenv').config();

const tokenSecret = process.env.TOKEN_SECRET || 'some other secret as default';
const tokenLife = +process.env.TOKEN_LIFE || 600;

const verifyJWTToken = (token) => {
  return new Promise((resolve, reject) => {
    jwtr.verify(token, tokenSecret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err)
      }
      const payload = {
        idUser: decodedToken.idUser,
        typeId: decodedToken.typeId,
        password: decodedToken.password
      };
      jwtr.sign(payload, tokenSecret, {
          expiresIn: tokenLife
        },
        (err, newToken) => {
          if (err) {
            res.status(500)
              .json({
                error: "Error signing token",
                raw: err
              });
          }
          decodedToken.prewToken = token;
          decodedToken.newToken = newToken;
          resolve(decodedToken)
        });
    })
  })
}

module.exports = verifyJWTToken;
