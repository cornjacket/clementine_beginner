'use strict';

var path = process.cwd();
var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var PollHandler = require(process.cwd() + '/app/controllers/pollHandler.server.js');

module.exports = function (app, passport) {
    
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }    
    
    var clickHandler = new ClickHandler();
    var pollHandler = new PollHandler();
    
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
    

    app.route('/api/polls/new')
      .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/new_poll.html');
    })
      .post(isLoggedIn, function(req, res) {    // i think i need to have a response else the browser errors out - research this
        console.log("index.js: post /api/polls/new received")
        console.log(req.body)
        console.log(req.user.github)
        pollHandler.createPoll(req, res) // not sure about how this is being invoked. is this node way
        // THE FOLLOWING SHOULD BE A CALLBACK TO MAKE SURE THAT THE POLL HAS FIRST BEEN CREATED BEFORE REDIRECTING
        res.redirect('/')
        //res.sendFile(path + '/public/new_poll.html'); // testing for now so the display doesn't explode on me
        //console.log(res)
        //res.json({ result: "result"})
      })
      
    app.route('/api/polls')
      .get( function (req, res) {
        console.log("index.js: get /api/polls received")
        pollHandler.listPolls({},req,res)
      })    
    
    
    app.route('/profile')
      .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/profile.html');
    });

    // gets accessed from clickController.client
    app.route('/api/clicks')    // this doesnt appear to be working
        .get(clickHandler.getClicks)
       /* function(req, res) {
          console.log('GET /api/clicks is being routed')
          console.log(req)
          res.json({clicks: 5})
        })*/
        .post(clickHandler.addClick)
        .delete(clickHandler.resetClicks);  
    
    
    // gets accessed from userController.client
    app.route('/api/user')
      .get(isLoggedIn, function (req, res) {
        console.log("GET /api/user is being routed")
        res.json(req.user.github);
    });
    
    app.route('/auth/github')
      .get(passport.authenticate('github'));
    
    app.route('/auth/github/callback')
      .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
    
  /*  app.route('/api/:id/clicks')
      .get(isLoggedIn, clickHandler.getClicks)
      .post(isLoggedIn, clickHandler.addClick)
      .delete(isLoggedIn, clickHandler.resetClicks);
    */
    
      
        
};