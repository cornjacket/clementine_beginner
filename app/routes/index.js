'use strict';

var path = process.cwd();
var PollHandler = require(process.cwd() + '/app/controllers/pollHandler.server.js');
var UserHandler = require(process.cwd() + '/app/controllers/userHandler.server.js');

module.exports = function (app, passport) {
    
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/');
        }
    }    
    
    var pollHandler = new PollHandler()
    var userHandler = new UserHandler()
    // THIS IS WHY IT WAS NOT WORKING WITH UserHandler, because I needed a
    // var userHandler = new UserHandler()
    
    app.route('/')
      .get(function (req, res) {
        res.sendFile(path + '/public/index.html');
    });

/*    app.route('/login')
      .get(function (req, res) {
        res.sendFile(path + '/public/login.html');
    });
*/        
    app.route('/logout')
      .get(function (req, res) {
        req.logout();
        res.redirect('/');
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
      })

      
    app.route('/api/polls/:id')
      .put( function (req, res) {
        console.log("index.js: put /api/polls/:"+req.body._id+" received")
        console.log(req.body)
        console.log(req.body.poll.votes[0])
        console.log(req.body.poll.votes[1])
        console.log(req.body.tags)
        //console.log(req)
        pollHandler.updateVotes(req, res)
        //res.json("ok") //req.user.github); // -- This is not being used. Can remove later
      })
      .delete(isLoggedIn, function(req, res) {
        console.log("index.js: delete /api/polls/:"+req.body._id+" received")
        console.log(req.params)
        pollHandler.deletePoll(req, res)
        //res.json("ok")
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

    // gets accessed from userController.client
    app.route('/api/user')
      .get(isLoggedIn, function (req, res) {
        console.log("GET /api/user is being routed ***************************")
        
        res.json(req.user.github);
    });
    
    // a separate path just for listing all the users
    app.route('/api/users')
      .get(function (req, res) {
        console.log("GET /api/users is being routed ***************************")
        userHandler.listUsers({},req,res)
        //res.json({ data: ["Everything is ok", "Life is good"] });
    });    
    
    app.route('/auth/github')
      .get(passport.authenticate('github'));
    
    app.route('/auth/github/callback')
      .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login' // authentication redirects but I want to have same page for logged in/out just different behavior
    }));
    

      
        
};