// const LocalStrategy = require('passport-local').Strategy;
const {Strategy, ExtractJwt} = require('passport-jwt');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = mongoose.model('users');
const secret = process.env.SECRET || 'some other secret as default';
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

module.exports = passport => {
  passport.use(
      new Strategy(opts,(id, password, done) => {
        // Match user
        console.log('!!!!!!!!!!!!!',id + password)
        User.findOne({
          idUser: id,
        }).then(user => {
          if (!user) {
            return done(null, false, { message: 'No User Found' });
          }
    
          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Password Incorrect' });
            }
          })
        })
      }));

/* module.exports = function (passport) {
  passport.use(new LocalStrategy({ usernameField: 'idUser' }, (id, password, done) => {
    // Match user
    console.log(id + password)
    User.findOne({
      idUser: id,
    }).then(user => {
      if (!user) {
        return done(null, false, { message: 'No User Found' });
      }

      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Password Incorrect' });
        }
      })
    })
  })); */

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}
