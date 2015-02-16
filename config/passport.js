/******************************************************************************
passport.js: Configuration for passport-local module.
 *****************************************************************************/

var LocalStrategy   = require('passport-local').Strategy;
var User = require('../models/user_model');

// expose this function to our app using module.exports
module.exports = function(passport) {

    /* Session serialization */
    passport.serializeUser(function(user, done) {
        done(null, user.email);
    });

    passport.deserializeUser(function(email, done) {
        User.findOne( { email: email } , function (err, user) {
            done(err, user);
        });
    });

    /* Login Strategy */
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'pw'
        },
        function(email, pw, callback) {
            User.findOne({ email: email }, function(err, user) {
                if (err) { return callback(err); }
                if (!user) { return done(null, false, { message: 'Unknown user ' + email }); }
                user.comparePassword(pw, function(err, isMatch) {
                    if (err) return callback(err);
                    if(isMatch) {
                        return callback(null, user);
                    } else {
                        return callback(null, false, { message: 'Invalid password' });
                    }
                });
            });
        }
    ));

    /* Signup Strateg */
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'pw',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, pw, callback) {
            // we are checking to see if the user trying to login already exists
            User.findOne({ 'email' : email }, function(err, user) {
                // if there are any errors, return the error
                if (err) {
                    return callback(err);
                }
                // check to see if already a user with that email
                if (user) {
                    return callback(null, false, { message: 'That email is already taken.' });
                }
                else {
                    var name = req.body.name;
                    // check to see if already a user with that name
                    User.findOne({'name': name}, function(er, usr) {
                        if (er) {
                            return callback(er);
                        }
                        if (usr) {
                            return callback(null, false, {message: 'That username is already taken'});
                        }
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        newUser.email = email;
                        newUser.name = req.body.name;
                        newUser.pw = pw;
                        // save the user
                        newUser.save(function(err) {
                            if (err) {
                                throw err;
                            }
                            return callback(null, newUser);
                        });
                    });
                }
            });
        }
    ));
};