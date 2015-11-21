'use strict';

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {
    
    var path = process.cwd();
    var clickHandler = new ClickHandler();
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }    
    
    
    app.route('/')
      .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/index.html');
    });    
    
    app.route('/login')
      .get(function (req, res) {
        res.sendFile(path + '/public/login.html');
    });

    app.route('/logout')
      .get(function (req, res) {
        req.logout();
        res.redirect('/login');
    });

    app.route('/poll/new')
      .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/new_poll.html');
    })
      .post(isLoggedIn, function(req, res) {    // i think i need to have a response else the browser errors out - research this
        console.log("index.js: post /poll received")
        //console.log(res)
        //res.json({ result: "result"})
      })

    app.route('/profile')
      .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/profile.html');
    });
    
    app.route('/api/:id')
      .get(isLoggedIn, function (req, res) {
        res.json(req.user.github);
    });    
    
    app.route('/auth/github')
      .get(passport.authenticate('github'));
    
    app.route('/auth/github/callback')
      .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));    
    
    
    
    app.route('/api/:id/clicks')
      .get(isLoggedIn, clickHandler.getClicks)
      .post(isLoggedIn, clickHandler.addClick)
      .delete(isLoggedIn, clickHandler.resetClicks);
    
};