module.exports = {
  ensureAuthenticated: function(req, res, next){
    
    console.log('req :', req.isAuthenticated());
    if(req.isAuthenticated()){
      return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/signin');
  }
}