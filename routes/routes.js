var passport = require('passport');
// var jwt = require('jsonwebtoken');
var UserController = require('../controller/userController');
var AuthController = require('../controller/authController');
var CategoryController = require('../controller/categoryController');
var BookController = require('../controller/bookController');
var verifyToken = require('../middleware/jwt-auth');
// var config = require('../config/database');

module.exports = function routes(server) {
  server.get('/',function(req,res){
    res.json('welcome to my node');
  });


  server.post('/login',AuthController.login,genericResponse);
  server.get('/logout',AuthController.logout,genericResponse);
  server.post('/signup',UserController.encryptUserPassword,UserController.createUser,genericResponse);
  server.get('/verify_email/:token',UserController.verifyEmail,genericResponse);
  server.get('/users',verifyToken,UserController.getAllUsers,genericResponse);
  server.post('/category',verifyToken,CategoryController.createCategory,genericResponse);
  server.get('/categories',verifyToken,CategoryController.getCategories,genericResponse);
  server.post('/book',verifyToken,BookController.createBook,genericResponse);

}

function genericResponse(req, res) {
    const response = {data: res.data};
    if(res.pagination){
        response.pagination = res.pagination;
    }
    res.send(response);
}
