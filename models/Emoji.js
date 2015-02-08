/**************************************************************************
Emoji.js
DB intermediary layer for Emoji Collection
**************************************************************************/

var mongoose = require('mongoose');

var emojiSchema = new mongoose.Schema({
  Unicode : { type : String, required : true },
  UTF8 : String,
  Url : String,
  Description: String,
  Symbol: String
});

module.exports = mongoose.model('emoji', emojiSchema, 'emoji');
