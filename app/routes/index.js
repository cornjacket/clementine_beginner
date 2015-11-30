'use strict';

var path = process.cwd();
var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {
    
    
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            res.redirect('/login');
        }
    }    
    
    var clickHandler = new ClickHandler();
    
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
    app.route('/api/:id')
      .get(isLoggedIn, function (req, res) {
        console.log("GET /api/:id is being routed")
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