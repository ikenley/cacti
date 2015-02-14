/* GET home page. */
var Emoji = require('../models/Emoji.js');

exports.index = function(req, res) {
  Emoji.find({}, function(err, emos) {
    if (err) {
      res.send(err);
    }
    pageConfig = { title: 'Emojr', emojis: emos, user: req.user };
    res.render('index', pageConfig);
  });

};
