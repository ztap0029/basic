const Category = require('../models/category');
var config = require('../config/database');

module.exports = {
  createCategory,
  getCategories
};

function createCategory(req,res,next){
  // Data array containing seed data - documents organized by Model
const data = [
    {
        category_name: 'comics',
    },
    {
        category_name: 'social',
    },
    {
      category_name: 'sport'
    }

];
  // let seedPrimises = [];
  data.forEach((record) => {
      const category = new Category(record);
      category.save(function(err,sCategory){
        if(err){
          next(err);
          return;
        }

      });

});
  res.data = 'yes got it';
  next();
}


/* Get categories */
function getCategories(req,res,next){
  // console.log(req.body);
  Category.find({},function(err,category){
    if(err){
      next(err);
      return;
    }
    res.data = category;
    next();
  })
}
