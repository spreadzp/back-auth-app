
const verifyJWTToken = require('./../helpers/verifierToken.js');

module.exports = (req, res, next) =>
{
  console.log(req)
  console.log('!!!req :', req.headers.authorization);
  let token = (req.method === 'POST') ? req.body.token : req.query.token

  verifyJWTToken(token)
    .then((decodedToken) =>
    {
      console.log('decodedToken :', decodedToken);
      req.user = decodedToken
      next()
    })
    .catch((err) =>
    {
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/users/signin');
    })
}