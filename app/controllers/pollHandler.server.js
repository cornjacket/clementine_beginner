'use strict';

function PollHandler () {

  var Polls = require('../models/polls');

  this.createPoll = function (req, res) {
      
    console.log("PollHandler:createPoll() invoked")
    //console.log(req)
    
    console.log(req.user._id)
    console.log(req.user.github.id)
    console.log(req.body)
    console.log(req.body.question)
    console.log(req.body.option1) // these should fail now 
    console.log(req.body.option2) // these should fail now
    var newPoll = new Polls();

    // we are kinda being redundant with the id and name and username but for now, it makes things easier. optimize later
    newPoll.author.github_id = req.user.github.id; // just simpler to use github_id
    newPoll.author.name = (req.user.github.displayName !== null) ? req.user.github.displayName : req.user.github.username;
    newPoll.author.username = req.user.github.username; // useful when wanting to look up poll by username
    newPoll.poll.question = req.body.question;
    newPoll.poll.options = []
    newPoll.poll.options = req.body.option //.push(req.body.option1)
    //newPoll.poll.options.push(req.body.option2)
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
  
  
  this.updateVotes = function (req, res) {
        console.log("DRT")
        console.log(req.body._id)
        Polls
            .findOneAndUpdate({ '_id': req.body._id}, //"565e9c0e71c8197f6deed728" }, //req._id }, 
              { $set: 
                { 
                  'poll.votes': req.body.poll.votes 
                }
              },
              { new: true }
             ) // need to replace with  req.poll.votes
            .exec(function (err, result) {
                    if (err) { throw err; }
                    console.log("pollHander.updateVotes()")
                    console.log(result)
                    res.json("ok")
                    //res.json(result.poll.votes); // not sure what to return here
                }
            );
  };

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