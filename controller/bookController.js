const Book = require('../models/book');
var config = require('../config/database');

module.exports = {
  createBook,
  getAllBooks
};

function createBook(req,res,next){
  //console.log(req.body);
  const book = new Book(req.body);
  book.save(function(err,sBook){
    if(err){
      return next(err);
    }
    res.data = sBook;
    next();
  });
}

function getAllBooks(req,res,next){
  Book.find({},function(err,sBook){
    if(err){
      next(err);
      return;
    }
    res.data = sBook;
    next();
  });
}
