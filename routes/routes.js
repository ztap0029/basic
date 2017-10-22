var passport = require('passport');
var jwt = require('jsonwebtoken');
var UserController = require('../controller/userController');
var config = require('../config/database');

module.exports = function routes(server,passport) {
  server.get('/',function(req,res){
    res.json('welcome to my node');
  });

  server.post('/login',UserController.login,genericResponse);
  server.post('/signup',UserController.encryptUserPassword,UserController.createUser,genericResponse);
  server.get('/verify_email/:token',UserController.verifyEmail,genericResponse);
  server.get('/profile',passport.authenticate('jwt',{session:false}),function(req,res){
    res.json("Success! You can not see this without a token");
  });

}

function genericResponse(req, res) {
    const response = {data: res.data};
    if(res.pagination){
        response.pagination = res.pagination;
    }
    res.send(response);
}
