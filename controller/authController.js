const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);
var config = require('../config/database');

module.exports = {
  login,
  logout
};

function login(req,res,next){
  var email = req.body.email;
  var password = req.body.password;
  User.findOne({email:email},function(err,user){
    if(err) return res.status(400).send({ error: 'Email OR Password not matched',status_code:400 });
    if(!user) return res.status(400).send({ error: 'Email OR Password not matched',status_code:400 });
    //var hashPassword = user.password;
    if(user.email_verified == false){
      return res.status(401).send({ error: 'Email is not verified yet',status_code:401 });
    }
    //console.log("user is:"+user);
    bcrypt.compare(password,user.password,function(err,isMatched){
      if(err) return res.status(401).send({error:'Unauthorized user',status_code:401});
      if(isMatched){
        suser = user.toObject();
              delete suser.password;
        var token = jwt.sign({user: suser}, config.secret, {
          expiresIn: '60m',
          algorithm: 'HS256'
        });
            res.data = [{sucess:true,user:suser,token:'Bearer '+token}];
          next();
      }else {
        res.status(400).send({error:'Password not matched',status_code:400});
      }
    });
  });
}

function logout(req,res,next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    //console.log(bearerToken);
     var refreshed = jwtBlacklist.blacklist(bearerToken);
    //  console.log(refreshed);
    jwt.verify(bearerToken, config.secret, function(err, decoded) {
            if (err) { //failed verification.
              res.data = 'user logout successfully';
              next();
              return;
              // console.log(err);
              //  return res.json({"error": err});
            }
            res.data = "something went wrong,user is not logged out.";
            next();

        });
    }else {
      res.data = "token is not present";
       next();
    }
}
