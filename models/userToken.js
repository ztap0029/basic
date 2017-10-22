var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');

let userTokenSchema = mongoose.Schema({
  id: {
        type: String,
        default:uuid.v4,
    },
  user_id:{
        type:String
    },
  token:{
        type:String
    }
  },
  {
    timestamps:true,versionKey: false,
  });

  const UserToken = mongoose.model('UserToken', userTokenSchema);

  module.exports = UserToken;
