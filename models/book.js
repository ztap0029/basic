var mongoose = require('mongoose');
var config = require('../config/database');
let uuid = require('uuid');

let bookSchema = mongoose.Schema({
  id: {
        type: String,
        default:uuid.v4,
    },
    user_id: {
          type: String
      },
    category_id: {
            type: String
        },
    book_name: {
              type: String
          },
    description: {
                type: String
            }
       },
    {
      timestamps:true,versionKey: false,
    });

    const Book = mongoose.model('Book', bookSchema);

    module.exports = Book;
