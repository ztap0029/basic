var express = require('express');
var bodyParser = require('body-parser');
var server = express();
var morgan = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');
// var passport = require('passport');
var routes = require('./routes/routes');
var config = require('./config/database');
var port = process.env.PORT || 3000;

mongoose.connect(config.db,{
  useMongoClient:true
});
mongoose.Promise = global.Promise;
// require('./config/passport')(passport);

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:true}));
server.use(morgan('dev'));
server.use(cors());
// server.use(passport.initialize());
// server.use(passport.session());
routes(server);
server.listen(port,function(){
  console.log("server is running on port:"+port);
})

module.exports = server;
