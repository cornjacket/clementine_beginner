'use strict';

function UserHandler () {

  var Users = require('../models/users');


  this.getNumPollsVoted = function (req, res) {
        console.log("clickHandler.server: getClicks() invoked "+ req.user.github.id)
        Users
            .findOne({ 'github.id': req.user.github.id }, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw err; }

                res.json(result.polls.num_voted);
            });
  };
  
  this.getNumPollsCreated = function (req, res) {
        console.log("clickHandler.server: getClicks() invoked "+ req.user.github.id)
        Users
            .findOne({ 'github.id': req.user.github.id }, { '_id': false })
            .exec(function (err, result) {
                if (err) { throw err; }

                res.json(result.polls.num_created);
            });
  };  
  
  this.incrementPollCount = function (req, res) {
        Users
        .findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'polls.num_created': 1 } })
        .exec(function (err, result) {
            if (err) { throw err; }
            console.log("increment user's polls.num_created")
            //res.json(result.polls.num_created); -- redirect already sent. arch change needed if we want to use this.
            }
        );
  };

  this.decrementPollCount = function (req, res) {
        Users
        .findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'polls.num_created': -1 } })
        .exec(function (err, result) {
            if (err) { throw err; }
            console.log("decrement user's polls.num_created")
            res.json(result.polls.num_created);
            }
        );
  };

  this.addToVoteCount = function (req, res) {
        Users
            .findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'polls.num_voted': 1 } })
            .exec(function (err, result) {
                    if (err) { throw err; }
                    console.log("increment user's polls.num_voted")
                    res.json("ok")
                    //res.json(poll_result.poll.vote_count); poll_result was from pollHandler // dont think i need to return vote_count here since the client side code is already figuring it out
                    //res.json(result.polls.num_created); -- return vote_count instead
                }
            );
  };


  this.listUsers = function (search_param,req,res) {
        console.log("Searching for : "+search_param)
        Users
            .find(search_param, function (err, result) {
                if (err) { throw err; }
                //console.log("pollHandler.server: " + result) // uncomment to inspect poll
                ////res.json(result) -- returning result like this breaks Angular, though this did work with vanillaJS
                res.json({ data: result}); // so encap'ing inside an object solves this problem
            });
  };

  
}

module.exports = UserHandler;