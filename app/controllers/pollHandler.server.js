'use strict';

function PollHandler () {

  var Polls = require('../models/polls');

  this.createPoll = function (req, res) {
      
    console.log("PollHandler:createPoll() invoked")
    //console.log(req)
    
    console.log(req.user._id)
    console.log(req.user.github.id)
    console.log(req.body.question)
    console.log(req.body.option1)
    console.log(req.body.option2)
    var newPoll = new Polls();

    // we are kinda being redundant with the id and name and username but for now, it makes things easier. optimize later
    newPoll.github.id = req.user._id; //github.id; // not sure what i am doing here. what is the logic?
    newPoll.github.name = (req.user.github.displayName !== null) ? req.user.github.displayName : req.user.github.username;
    newPoll.github.username = req.user.github.username; // useful when wanting to look up poll by username
    newPoll.poll.question = req.body.question;
    newPoll.poll.options = []
    newPoll.poll.options.push(req.body.option1)
    newPoll.poll.options.push(req.body.option2)
    newPoll.poll.votes = [0, 0]
    newPoll.save(function (err) {
        if (err) {
            throw err;
        }
    });
    // the clickController code returned some json but right now i am not doing that. instead i am letting the route redirect
    
    // Also I am letting index.js determine the action to do, either by not doing anything here
  }

  this.listPolls = function (search_param,req,res) {
        console.log("Searching for : "+search_param)
        Polls
            .find(search_param, function (err, result) {
                if (err) { throw err; }
                console.log("pollHandler.server: " + result)
                //res.json({ message: "Polls end point"}) // testing
                //res.json(result) -- returning result like this breaks Angular, though this did work with vanillaJS
                res.json({ data: result}); // so encap'ing inside an object solves this problem
            });
  };
  
/*  
  this.addClick = function (req, res) {
        Users
            .findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
            .exec(function (err, result) {
                    if (err) { throw err; }

                    console.log("clickHandler.server: addClick()")
                    res.json(result.nbrClicks);
                }
            );
  };
*/
/*
  this.resetClicks = function (req, res) {
        Users
            .findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
            .exec(function (err, result) {
                    if (err) { throw err; }

                    res.json(result.nbrClicks);
                }
            );
  };
*/  
  
}

module.exports = PollHandler;