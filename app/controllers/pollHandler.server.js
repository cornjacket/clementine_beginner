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
    newPoll.author.github_id = req.user.github.id; // just simpler to use github_id
    newPoll.author.name = (req.user.github.displayName !== null) ? req.user.github.displayName : req.user.github.username;
    newPoll.author.username = req.user.github.username; // useful when wanting to look up poll by username
    newPoll.poll.question = req.body.question;
    newPoll.poll.options = []
    newPoll.poll.options.push(req.body.option1)
    newPoll.poll.options.push(req.body.option2)
    newPoll.poll.votes = []
    // each subarray in votes contains the user_id's for the respective options subarray
    console.log("DRT")
    console.log(newPoll.poll.options)
    console.log(newPoll.poll.options.length)
    newPoll.poll.options.forEach(function() {
        newPoll.poll.votes.push([]) // add an empty array inside votes array for each option,
    })
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