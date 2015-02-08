/****************************************************************************
emojiController.js
Controls all Emoji requests.
****************************************************************************/

var Emoji = require('../models/Emoji.js');

exports.main = function(req, res) {
      //TODO Error handling
      var pageConfig = { title: 'Emoji Detail' };
      var symbol = req.param('symbol');
      console.log('symbol: ' + symbol);
      var unicode = unicodeToString(symbol);
      console.log('unicode: ' + unicode);
      var emo = Emoji.findOne({Unicode: unicode}, function(err, emo) {
        if (err) {
          res.send(err);
        }
        console.log(emo);
        emo.Unicode = emo.Unicode.toLowerCase();
        pageConfig.emoji = emo;
        pageConfig.emoji.Symbol = symbol;
        res.render('detail', pageConfig);
      });
};

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
