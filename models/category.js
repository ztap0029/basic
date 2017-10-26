var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');

let categorySchema = mongoose.Schema({
  id: {
        type: String,
        default:uuid.v4,
    },
    category_name: {
          type: String
      }
       },
    {
      timestamps:true,versionKey: false,
    });

    const Category = mongoose.model('Category', categorySchema);

    module.exports = Category;
