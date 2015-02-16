/**************************************************************************
 comment_model.js: DB intermediary layer for Comment Collection
 **************************************************************************/

var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    emojiId: { type: mongoose.Schema.Types.ObjectId, required: true, index: 1},
    desc: String,       //content of comment
    score: Number,
    votes: [{ user_id : mongoose.Schema.Types.ObjectId , type: Number }],
    postedBy: { type: String, ref: 'User' },
    posted: { type: Date }
},{ collection: 'comment'});

module.exports = mongoose.model('comment', commentSchema, 'comment');
