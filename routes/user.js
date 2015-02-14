/******************************************************************************
 users.js: Controller for User login management
 *****************************************************************************/

/* Renders login page */
exports.login = function(req, res) {
  res.render('login', {title: 'Login', message: req.session.messages, user: req.user });
};

/* Authenticates login POST.*/
exports.authenticate = function(passport) {
    return function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.session.messages =  [info.message];
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        })(req, res, next);
    };
};

/* process the signup form */
exports.signup = function(passport) {
    return function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) { return next(err) }
            if (!user) {
                req.session.messages =  [info.message];
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        })(req, res, next);
    };
};

/* Log out of user session */
exports.logout = function(req, res) {
    req.logout();
    res.redirect('/');
};


