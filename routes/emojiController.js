/****************************************************************************
emojiController.js
Controls all Emoji requests.
****************************************************************************/

var mongoose = require('mongoose');
var Emoji = require('../models/Emoji');
var Comment = require('../models/comment_model');

exports.main = function(req, res) {
    var pageConfig = { title: 'Emoji Detail', user: req.user };
    var symbol = req.query.symbol == null ? req.params.symbol : req.query.symbol;
    console.log('symbol: ' + symbol);
    var renderDetail = function(err, emo) {
        if (err) {
            res.send(err);
        }
        //If emoji not found, redirect to "404" emoji
        if (!emo) {
            return res.redirect('/e/%F0%9F%8C%8B');
        }
        console.log(emo);
        emo.Unicode = emo.Unicode.toLowerCase();
        pageConfig.emoji = emo;
        pageConfig.emoji.Symbol = symbol;
        res.render('detail', pageConfig);
    };
    //If symbol is unicode, search for matching unicode char
    if (symbol.length <= 2) {
        var unicode = unicodeToString(symbol);
        console.log('unicode: ' + unicode);
        Emoji.findOne({Unicode: unicode}, renderDetail);
    }
    //Else search description
    else {
        var regX = new RegExp('.*' + symbol + '.*', 'i');
        Emoji.findOne({Description: regX}, renderDetail);
    }
};

/*getComments(): Get all comments for a given Emoji */
exports.getComments = function(req, res) {
    var emojiId = new mongoose.Types.ObjectId(req.params.emojiId);
    Comment.find({emojiId: emojiId}, function(err, comments) {
       if (err) {
            res.send(err);
       }
        res.json(comments);
    });
}

exports.addComment = function(req, res) {
    var emojiId = new mongoose.Types.ObjectId(req.params.emojiId);
    var desc = req.body.desc;
    var comment = new Comment({
        emojiId: emojiId,
        desc: desc,       //content of comment
        score: 0,
        postedBy: req.user.name,
        posted: new Date()
    });
    comment.save(function(err, com) {
        if (err) {
            console.log(err);
        }
    });
    res.json(comment);
}

/* unicodeToString(): Converts unicode char to string representation (sans u+) */
function unicodeToString(str)
{
  var top = 0;
  var n = 0;
  result = '';
  for (var i = 0; i < str.length; i++)
  {
    var b = str.charCodeAt(i);
    if (b < 0 || b > 0xFFFF) {
      return null;
    }
    if (top != 0) {
      if (0xDC00 <= b && b <= 0xDFFF) {
        result += dtox(0x10000 + ((top - 0xD800) << 10) + (b - 0xDC00)) + ' ';
        top = 0;
        continue;
        }
      else {
        result += '!erreur ' + dtox(top) + '!';
        top = 0;
        }
      }
    if (0xD800 <= b && b <= 0xDBFF) {
      top = b;
      }
    else {
      result += dtox(b) + ' ';
      }
  }
  result = result.substring(0, result.length-1);
  return result;
}

/* dtox(): decimal string to hex string. */
function dtox(str) {
  return (str+0).toString(16).toUpperCase();
}
