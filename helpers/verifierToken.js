const jwt = require('jsonwebtoken');

require('dotenv').config();
const tokenSecret = process.env.TOKEN_SECRET || 'some other secret as default';
 const verifyJWTToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenSecret, (err, decodedToken) => {
      if (err || !decodedToken) {
        return reject(err)
      }
      console.log('decodedToken :', decodedToken);
      resolve(decodedToken)
    })
  })
}

module.exports = verifyJWTToken;
