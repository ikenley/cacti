var Mongoose = require('mongoose');

exports.SpaceSchema = new Mongoose.Schema({
  name : { type : String, required : true },
  dest : String,
  src : String
});
