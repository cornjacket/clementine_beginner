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

    newPoll.github.id = req.user._id; //github.id;
    newPoll.github.displayName = req.user.github.displayName;
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

  this.listPolls = function (req,res) {
        Polls
            .find({}, function (err, result) {
                if (err) { throw err; }
                console.log("portHandler.server: " + result)
                res.json(result);
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