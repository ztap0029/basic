var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');

let userSchema = mongoose.Schema({
  id: {
        type: String,
        default:uuid.v4,
    },
  role: {
        type: String,
        default: 'user',
    },
    name: {
        type: String,
    },
  email:{
    type:String,
    required:true,
    unique:true
  },
    avatar: {
        type: String,
    },
  password:{
    type:String,
    required:true,
  //  select:false
  },
  email_verified:{
        type:Boolean,
        default:false,
    }
  //    created_at: {
  //      type: Date,
  //      default: Date.now
  //   },
  //   updated_at: {
  //     type: Date,
  //     default: Date.now
  //  }
},
{
  timestamps:true,versionKey: false,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
