var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var UserController = require('../controller/userController');
var config = require('../config/database');

module.exports = function(passport){
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.secret;
  //opts.issuer = 'accounts.examplesoft.com';
  //opts.audience = 'yoursite.net';
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //console.log('id: '+jwt_payload.user._id);
      UserController.getUserById(jwt_payload.user._id, function(err, user) {
          if (err) {
              return done(err, false);
          }
          if (user) {
          //  console.log("user mil gya: "+user);
              return done(null, user);
          } else {
              return done(null, false);
              // or you could create a new account
          }
      });
  }));

}
