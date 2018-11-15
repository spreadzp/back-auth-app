
const verifyJWTToken = require('./../helpers/verifierToken.js');

module.exports = (req, res, next) =>
{
  let token = (req.method === 'GET') ? req.query.token : req.body.token ;

  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      req.user = decodedToken
      next()
    })
    .catch((err) =>
    {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/users/signin');
    })
}
