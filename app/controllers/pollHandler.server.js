'use strict';

function PollHandler () {

  var Polls = require('../models/polls');
  var UserHandler = require(process.cwd() + '/app/controllers/userHandler.server.js');

  var userHandler = new UserHandler()

  this.createPoll = function (req, res) {
      
    console.log("PollHandler:createPoll() invoked")
    //console.log(req)

    console.log(req.user._id)
    console.log(req.user.github.id)
    console.log(req.body)
    console.log(req.body.data.question)
    var newPoll = new Polls();

    newPoll.author.github_id = req.user.github.id; // just simpler to use github_id
    newPoll.author.name = (req.user.github.displayName !== null) ? req.user.github.displayName : req.user.github.username;
    newPoll.author.username = req.user.github.username; // useful when wanting to look up poll by username
    newPoll.poll.question = req.body.data.question;
    newPoll.poll.options = []
    newPoll.poll.options = req.body.data.option 
    newPoll.poll.votes = []
    newPoll.poll.tags = req.body.data.tags.toLowerCase().split(',')
    // each subarray in votes contains the user_id's for the respective options subarray
    //console.log(newPoll.poll.options)
    //console.log(newPoll.poll.options.length)
    newPoll.poll.options.forEach(function() {
        newPoll.poll.votes.push([]) // add an empty array inside votes array for each option,
    })
    newPoll.poll.upVotes = 100 //bias the upvote by +100 and dec by 100 prior for display
    newPoll.poll.upVoter_id = [] //whoever up or down voted
    newPoll.poll.vote_count = 0 // vote_count for easier search (otherwise we have to count)
    newPoll.poll.isFlagged = false; 
    newPoll.poll.flagger_id = [] // use this to make a count
    
    console.log("Tags")
    console.log(newPoll.poll)

    newPoll.save(function (err) {
        if (err) {
            throw err;
        }
        console.log("TEST")
        console.log(UserHandler)
        
        userHandler.incrementPollCount(req,res)
        console.log("RESPONDING FROM SERVER: POLL HANDLER")
        console.log(newPoll._id)
        res.json(newPoll); //{ id: newPoll._id}); // so encap'ing inside an object solves this problem
    });
    // the clickController code returned some json but right now i am not doing that. instead i am letting the route redirect
    // Also I am letting index.js determine the action to do by not doing anything here
  }

  this.listPolls = function (search_param,req,res) {
        console.log("Searching for : "+search_param)
        Polls
            .find(search_param, function (err, result) {
                if (err) { throw err; }
                //console.log("pollHandler.server: " + result) // uncomment to inspect poll
                ////res.json(result) -- returning result like this breaks Angular, though this did work with vanillaJS
                res.json({ data: result}); // so encap'ing inside an object solves this problem
            });
  };
  
  
  this.updateVotes = function (req, res) {
        console.log("pollHandler.updateVotes() invoked")
        console.log(req.body._id)
        console.log("req.body.poll")
        console.log(req.body.poll)
        Polls
            .findOneAndUpdate({ '_id': req.body._id}, 
              { $set: 
                { 
                  'poll.votes': req.body.poll.votes 
                }
              },
              { new: true }
             ) 
            .exec(function (err, result) {
                    if (err) { throw err; }
                    console.log("pollHander.updateVotes()")
                    console.log(result)
                    
                    // This is a poor way to implement but the quickest to code.
                    // This needs to change at some point.
                    Polls
                        .findOneAndUpdate({ '_id': req.body._id}, { $inc: { 'poll.vote_count': 1 } })
                        .exec(function (err, poll_result) {
                                console.log("PollHandler: just inc'd vote_cote hopefully")
                                if (err) { throw err; }
                                console.log(req.user)
                                userHandler.addToVoteCount(req, res)
                            }
                        );                    
                    
                }
            );
  };

  this.deletePoll = function(req, res) {
    console.log("pollHandler.deletePoll() invoked")
      Polls.remove({ '_id': req.params.id}, function deletePoll(err) {
       console.log("poll deleted from database")
       if (err) { throw err; }
         userHandler.decrementPollCount(req,res)
      });
  }

}

module.exports = PollHandler;