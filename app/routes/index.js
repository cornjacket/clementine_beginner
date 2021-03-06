'use strict';

var path = process.cwd();
var PollHandler = require(process.cwd() + '/app/controllers/pollHandler.server.js');
var UserHandler = require(process.cwd() + '/app/controllers/userHandler.server.js');

module.exports = function (app, passport) {
    
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/'); // isLoggedIn is middleware that passes the req to the next stage, but now I dont
                               // want to simply redirect, I want to return the ip address for users that are not
                               // logged in.
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

        
    app.route('/logout')
      .get(function (req, res) {
        req.logout();
        res.redirect('/');
    });
    
    
// BOTH THE FOLLOWING ROUTES SHOULD BE REMOVED.    

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
       // console.log(req.body)
        
       
        console.log(req.body.poll_update) // DRT
        //console.log(req.body.poll.votes[0])
        //console.log(req.body.poll.votes[1])
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
        console.log("GET /api/polls received")
        pollHandler.listPolls({},req,res)
      })
      .post(isLoggedIn, function(req, res) {    // i think i need to have a response else the browser errors out - research this
        console.log("index.js: post /api/polls received")
        console.log(req.body)
        console.log(req.user.github)
        pollHandler.createPoll(req, res) // not sure about how this is being invoked. is this node way
        // THE FOLLOWING SHOULD BE A CALLBACK TO MAKE SURE THAT THE POLL HAS FIRST BEEN CREATED BEFORE REDIRECTING
        //res.redirect('/') // <- why wasnt this invoked
      })

// THIS SHOULD BE REMOVED    
    app.route('/profile')
      .get(isLoggedIn, function (req, res) {
        res.sendFile(path + '/public/profile.html');
    });

    // gets accessed from userController.client
    app.route('/api/user')
      //.get(isLoggedIn, function (req, res) {
      .get(function (req, res) {
        console.log("GET /api/user is being routed ***************************")
        if (req.isAuthenticated()) {
          res.json(req.user.github);
        } else {
          var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
          console.log("Requestor's IP Address is "+ip)
          res.json({ip: ip})
        }

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
    
    
// can I change this so that it does not redirect and instead recieves json data
// failure redirect should be to index, but it shouldnt be a redirect
    app.route('/auth/github/callback')
      .get(passport.authenticate('github', {
        successRedirect: '/',
        failureRedirect: '/login' // authentication redirects but I want to have same page for logged in/out just different behavior
    }));
    

      
        
};