var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

//Connect to MongoDB
var db = mongoose.connect('mongodb://localhost/emodb',
    function(err, res) {
        if (err) {
        console.log('ERROR connecting to mongodb://localhost/emodb. ' + err);
        }
        else {
          console.log('Connected to DB');
        }
    }
);

var routes = require('./routes');
var users = require('./routes/user');
var emoji = require('./routes/emojiController');

//Configure passport
require('./config/passport.js')(passport);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.session({ secret: '20xd6' }));
// Remember Me middleware
app.use( function (req, res, next) {
    if ( req.method == 'POST' && req.url == '/login' ) {
        if ( req.body.rememberme ) {
            req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
        } else {
            req.session.cookie.expires = false;
        }
    }
    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

app.get('/', routes.index);
app.get('/login', users.login);
app.post('/login', users.authenticate(passport));
app.post('/signup', users.signup(passport));
app.get('/logout', users.logout);
app.get('/comment/get/:emojiId', emoji.getComments);
app.post('/comment/add/:emojiId', emoji.addComment);
app.get('/e/:symbol', emoji.main);
app.get('/e', emoji.main);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', process.env.PORT || 8080);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});


module.exports = app;
