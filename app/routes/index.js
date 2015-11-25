'use strict';

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var PollHandler = require(process.cwd() + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {
    
    var path = process.cwd();
    var clickHandler = new ClickHandler();
    var pollHandler = new PollHandler();
    
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
        console.log(req.body)
        console.log(req.user.github)
        pollHandler.createPoll(req, res) // not sure about how this is being invoked. is this node way
        // THE FOLLOWING SHOULD BE A CALLBACK TO MAKE SURE THAT THE POLL HAS FIRST BEEN CREATED BEFORE REDIRECTING
        res.redirect('/')
        //res.sendFile(path + '/public/new_poll.html'); // testing for now so the display doesn't explode on me
        //console.log(res)
        //res.json({ result: "result"})
      })
      
    app.route('/poll/list')
      .get( function (req, res) {
        console.log("index.js: get /poll/list received")
        pollHandler.listPolls(req,res)
      })
      
    app.route('/poll/list/:id')
      .get( function (req, res) {
        console.log("index.js: get /poll/list:id received")
        pollHandler.listPolls(req,res) // need to change this later to pollHandler.listPollByUserId(req,res) -- id is in the req
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