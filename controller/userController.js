const User = require('../models/user');
const bcrypt = require('bcryptjs');
const UserToken = require('../models/userToken');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const jwtBlacklist = require('jwt-blacklist')(jwt);
var config = require('../config/database');

module.exports = {
  getOneUser,
  getUserById,
  createUser,
  encryptUserPassword,
  sendVerificationEmail,
  verifyEmail,
  getAllUsers
};

function getUserById(id,cb){
  User.findById(id,cb);
}

function getAllUsers(req,res,next){
  User.find({},'updatedAt createdAt email email_verified id').then(user=>{
    res.data = user;
    next();
  }).catch(err=>{
    return res.status(401).send({ error: 'No user found',status_code:401 });
  })
}

function encryptUserPassword(req,res,next){
  if (req.body && 'password' in req.body) {
       bcrypt.genSalt(10,function(errr,salt){
         bcrypt.hash(req.body.password,salt,function(err,hash){
           if(err) return next('Password hashing failure');
           req.body.password = hash;
           next();
         });
      });
    }else {
      next();
    }
  }

  /**
   * Create token
   * @param user
   */
function createToken(user){
  const uuidv1 = require('uuid/v1');
  let token = uuidv1();
  //console.log("token: "+token);
  const userToken = new UserToken({
  user_id:user.id,
  token:token,
  created_date: new Date()
 })

userToken.save()
        .then((sToken)=>{
    // console.log("Hash created "+JSON.stringify(sToken));
     sendVerificationEmail(user,sToken.token);
})
.catch((err)=>{
//  console.log("Error in creating hash "+JSON.stringify(err));
})
}

let transporter = nodemailer.createTransport({
       service:'Gmail',
       port: 587,
       auth: {
           user: 'aprajapat471@gmail.com',
           pass: 'Deepika@_143'
       }
   });

function sendVerificationEmail(user,token){
 //const email = encodeURIComponent(user.email);
 const myToken = token;
 const url = "http://localhost:3000/verify_email/"+myToken;
 //const myUrl = encodeURI(url);
 const verify = "Verify email address";
 let mailOptions = {
 from:'anil prajapat<aprajapat471@gmail.com>',
 to:user.email,
 subject:'Please verify',
 text:'',
 html:"<h4>Hello " +user.email+ "</h4><br><br><p>PLEASE CONFIRM YOUR EMAIL TO ACCESS YOUR REST-API ACCOUNT,PLEASE CLICK THE LINK BELLOW</p><br><br><a href=\"" + url +"\">"+verify+"</a>"
};

transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
           return console.log(error);
       }
       console.log('Message sent: %s', info.messageId);
       // Preview only available when sending through an Ethereal account
       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

       // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
       // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
   });

}

function verifyEmail(req,res,next){
  const token = req.params.token;
  //const em = req.query.email;
  //const email = decodeURIComponent(em);
  console.log(" token: "+token);
  UserToken.findOne({token: token}, function(errr,sUser){
      if(!sUser){
        // console.log("Hash not return res.status(500).send({ error: 'Duplicate voilation',status_code:500 });matched ");
          return res.status(401).send({ error: 'Invalid URL',status_code:401 });
        }
        const date1 = new Date();
        const tokenDate = sUser.createdAt;
        const date2 = new Date(tokenDate);
        const diff = Math.abs(date2.getTime() - date1.getTime());
        const hourDiff = Math.abs(diff)/36e5;

        UserToken.remove({user_id:sUser.user_id},function(error,obj){});
        if(hourDiff < 1){
            getOneUser({ id:sUser.user_id },res)
            .then(user => {
              console.log("user is: "+user);
                user.email_verified = true;
                user.save(function (err, updatedUser) {
                if (err) return next(err);
                res.data = 'User verified successfully';
                next();
                });
           })
           .catch(er =>{
             //console.log("error found: "+er);
             return res.status(400).send({ error: 'User not found',status_code:400 });
           });
         }else{
            return next("Invalid url");
        }
       });
   }

   function getOneUser(filter) {
       return User
       .findOne(filter)
       .then((user) => {
           if (!user) {
               return 'user not found';

           }
           return user;
       });
   }

/**
 * Create User
 * @param req
 * @param res
 * @param next
 */
function createUser(req,res,next){
//console.log(req.body);
// return res.json("successfully done");
      var newUser = new User(req.body);
      newUser.save(function(error,createdUser){
        if(error){
        //  console.log(error);
            if (error.name === 'MongoError' && error.code === 11000) {
              //Duplicate entry
              return res.status(500).send({ error: 'Duplicate voilation',status_code:500 });
              //return next('Duplicate voilation');
            }else{
              //return res.status(400).send({error:'Invalid arguments',success:false,status_code:400});
              return next(error);
            }
        }
        createdUser = createdUser.toObject();
              delete createdUser.password;
              createToken(newUser);
              res.data = createdUser;
      //  console.log(createdUser);
          // const response = {data: res.data};
          // res.status(200).send(response);
        return next();
      });
    }
