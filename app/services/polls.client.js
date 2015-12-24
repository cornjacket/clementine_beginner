(function() {
  var Poll = function($resource, $http) {


// isPollAuthoredByUser will be false if the user is not logged in when the polls are retrieved from
// the server. The question remains how will this field get updated, when the service caches the polls.
// Currently we are not caching, just restructing getPolls into a service.

   
   var cached_polls = null // use this to return cached version of polls



// I need the service to go off and grab the polls from the server and then append all the stuff
// that I need appended. Then I can return this as a promise to the calling routine.
    var Poll = $resource('/api/polls/:id', { id: '@_id' }, {
                 update: {
                   method: 'PUT' // this method issues a PUT request
                 }
               })

    var countVotes = function(poll) {
        
       // iterate through each votes subarray and sum and store
       // note that each votes[] subarray contains the id's for users that have voted for that respected
       // option. Therefore determining the vote count equates to taking the length of the array.
       // Note that now I am storing the vote count so we dont need to count votes. ie. following code
       // can be simplified. 
       console.log("countVotes() invoked")
            console.log(poll.item.poll.question)
            var new_poll_votes = new Array()
            console.log("Voting list")
            poll.item.poll.votes.forEach(function(vote_ary, vote_index, parent_ary) {
                console.log(vote_index+" "+vote_ary)
                new_poll_votes.push(vote_ary.length)
            })
            poll.aggregate_votes = new_poll_votes

    }


    var setGithubUserImage = function(poll) {
      return $http.get("https://api.github.com/users/" + poll.item.author.username)
              .then(function(response){
                 console.log(response.data.avatar_url)
                 poll.img = response.data.avatar_url
              });
    };

    var updateHasAlreadyVoted = function(poll,id) {  // Need to pass id as parameter
        
        console.log("_updateHasAlreadyVoted() invoked")
        console.log("SCOPE.ID = "+id)
            var alreadyVoted = false
            
            poll.item.poll.votes.forEach(function(vote_ary, vote_index, parent_ary) {
                if (vote_ary.indexOf(id) != -1) {
                    poll.has_voted_for_option[vote_index] = true
                    alreadyVoted = true
                } else {
                    poll.has_voted_for_option[vote_index] = false
                }
            })
            poll.hasVotedForPoll = alreadyVoted // this should work out of the box
        
    }


/////////////// How to handle isLoggedIn

    // Becareful, user has to be defined to run this function
    // fill $scope.pollAuthoredByUser which is used in view
    var determinePollAuthoredByUser = function(poll,id){ // *********** $scope.id needs to be passed in
      console.log("_determinePollsAuthoredByUser() invoked")
      poll.isPollAuthoredByUser = (poll.item.author.github_id === id)
    }

// Technically I should be using Poll.query() since I am getting all the polls, though my implementation does work.
// Something to refactor later. - but to make this change I believe that the Poll url should include :id
    var getPolls = function(user) {  // need to pass in the id of the current user
      console.log("getPolls() invoked")
      // If we return a promise, then the calling function can perform a .then on it.
      
      if (cached_polls === null) {
        
        cached_polls = Poll.get({}).$promise
        .then( function(results) {
      //$scope.polls = Poll.query( function() { //(results) {
          console.log("GETTING POLLS FROM THE SERVER")
          // need to make one array of objects that has all the info
          var polls = results.data.map(function(item) {
            
            return {
              item:                 item,  // contains info grabbed from server
              has_voted_for_option: [],    // order is important in this list, eventually
              isPollAuthoredByUser: false,
              hasVotedForPoll:      false, // if current user has voted on poll
              isPollDeleted:        false, // has user deleted this poll
              img:                  "http://isigned.org/images/anonymous.png",
              aggregate_votes:      []
            }
          })          
      
          polls.forEach(function(poll) {
            updateHasAlreadyVoted(poll,user.id)
            setGithubUserImage(poll) // parameters can be merged
            countVotes(poll)
            determinePollAuthoredByUser(poll,user.id)
          })
      
          
          console.log("HERE NOW")
          console.log(polls)
          return polls
          
        })
        return cached_polls
        
      } else { // if cached_polls
        console.log("*** Providing polls from local cache and not getting from server. ***")
      return cached_polls // but what are we returning here, that previous promise that has completed
      }
    }


/*
// Technically I should be using Poll.query() since I am getting all the polls, though my implementation does work.
// Something to refactor later. - but to make this change I believe that the Poll url should include :id
    var getPolls = function(user) {  // need to pass in the id of the current user
      console.log("getPolls() invoked")
      // If we return a promise, then the calling function can perform a .then on it.
      return Poll.get({}).$promise
        .then( function(results) {
      //$scope.polls = Poll.query( function() { //(results) {
      
          // need to make one array of objects that has all the info
          var polls = results.data.map(function(item) {
            
            return {
              item:                 item,  // contains info grabbed from server
              has_voted_for_option: [],    // order is important in this list, eventually
              isPollAuthoredByUser: false,
              hasVotedForPoll:      false, // if current user has voted on poll
              isPollDeleted:        false, // has user deleted this poll
              img:                  "http://isigned.org/images/anonymous.png",
              aggregate_votes:      []
            }
          })          
      
          polls.forEach(function(poll) {
            updateHasAlreadyVoted(poll,user.id)
            setGithubUserImage(poll) // parameters can be merged
            countVotes(poll)
            determinePollAuthoredByUser(poll,user.id)
          })
      
          
          // The user can determine the lenth of polls when they use .length
          //$scope.num_polls = $scope.polls.length 

          console.log("HERE NOW")
          console.log(polls)
          return polls
          
      })
        }
*/

    // Now vote() explicitly checks to see whether or not the user has voted on a poll instead of
    // assuming the gui will not display the vote button. We should assume there will be bugs in the code
    // and that we will need multiple safeguards to prevent voter fraud. :)
    var vote = function(poll, option_number, id) {
      console.log("pollSerivce: vote(): invoked with id = "+id) 
      if (poll.hasVotedForPoll === false) {
        if (poll.item.poll.votes[option_number].indexOf(id) === -1) {
          poll.item.poll.votes[option_number].push(id)
          console.log("You just voted for poll XXX option "+option_number)
          poll.hasVotedForPoll = true
          poll.has_voted_for_option[option_number] = true
          poll.aggregate_votes[option_number]++ 
          // Now call update passing in the ID first then the object you are updating
          // implementing update in this manner is dangerous. there is a contention between 2 different users
          return Poll.update({ id:poll.item._id }, poll.item).$promise // update_user_lookup);          
        } else {
            console.log("ERROR: vote(): trying to vote when votes array already contains user.id")
            console.log("ERROR: "+poll.item.poll.votes[option_number]+" "+id)
        }
      } else {
          console.log("ERROR: vote(): trying to vote when hasVotedForPoll === "+poll.hasVotedForPoll)
      }
    }

    var deletePoll = function(poll, id) {
        // need a safety precaution to check if user is author of poll to delete
        if (id === poll.item.author.github_id) {
        // i could also put up a pop up confirming the deletion - not sure - see angular directives video
        console.log("deletePoll() invoked")
        poll.isPollDeleted = true
        //$scope.num_polls--
        return Poll.delete({ id:poll.item._id }).$promise //, update_user_lookup);   
        } else {
            // I can envision this happening while using $index
            console.log("ERROR: deletePoll. Trying to delete a poll by non-author")
            console.log(id)
            console.log(poll.item.author.github_id)
        }
    }


    
 
    
    return {
      getPolls:   getPolls,
      deletePoll: deletePoll,
      vote:       vote
    };
    
  };
  
  var module = angular.module("pollPosition");
  // register service with angular
  module.factory("Poll", Poll);
  
  
}());