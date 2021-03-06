(function() {
  var User = function($resource) {
    
    var UserResource = $resource('/api/user/:id');
    var UsersResource = $resource('/api/users/:id'); // I need to revisit why this behavior is happening. Maybe inspect mean.js code

    var user_id = undefined
    var cached_user = null // what to do if the user logs out - how does this get setback to null
    var cached_users = null
    var prev_user_id = null

    // first time getUser is called it returns an id of undefined.
    // this is because the user has not logged in yet and it is the initial response.
    // therefore we can not cache the first call to get the user
    var get = function (id) { // dont believe id is used or needed
       console.log("**********************************************")
       console.log("getUser() invoked")
       console.log("GETUSER() id = "+id)
       console.log("previous id = "+prev_user_id)
       console.log("user_id = "+user_id)
       
       
      if (cached_user === null || user_id !== prev_user_id) { // !== is necessary so no type conversion for null to undefined
        cached_user = UserResource.get({ id: id }).$promise  // dont believe the actual value of id is being used
         .then(function(results) {
           console.log("User.get() id followed by ip")
           //id will return undefined if not authenticated, but ip will be defined
           //if authenticated, then id will return non-undefined, but ip will be undefined
           //need to have additional check if whether a user can vote on a poll. polls that are open to everyone
           console.log(results.id)
           console.log(results.ip)
           var user = {}          
           if (results.id !== undefined) {
             
             user.isLoggedIn = true
             user.name = (results.displayName !== null) ? results.displayName : results.username
             user.displayName = (results.displayName !== null) ? results.displayName : "none"
             user.id = results.id
             user_id = results.id
             console.log("************ USER ID = "+user_id+" ******************")
             user.username = results.username
             user.publicRepos = results.publicRepos
             //user.isLoggedIn = results.username !== undefined
             prev_user_id = user_id
           } else {
             user.isLoggedIn = false
             user.ip = results.ip
             console.log("************ Anonymouse user at ip = "+user.ip+" ******************")
           }
           return user
             
         })
         console.log("********** Retrieving USER FROM SERVER ******************")
         return cached_user
      } else {
          console.log("************ Retrieving USER FROM CACHE ******************")
          return cached_user
      }
    }

    // pulled these variables out so that I can have vote and delete api calls
    var user_lookup = {}
    var score_board = []
    var stats       = {}
    stats.num_votes = 0
    stats.num_users = 0
    
  
    var decrementPollsCreated = function(username) {  // passed $scope.user.username
      console.log("users.deletePoll() invoked")
      
      console.log(username)
      user_lookup[username].polls_created--
      
      // iterate through the score_board
      score_board.forEach(function(user,user_index,ary) {
        if (user.username === username) { 
          console.log(user.username+" has been found")
          // now i need to decrement polls_created for this element - should quit early from this loop
          user.polls_created--
        }
      })      
    }  

    var incrementPollsCreated = function(username) {  // passed $scope.user.username
      console.log("users.deletePoll() invoked")
      
      console.log(username)
      user_lookup[username].polls_created++
      
      // iterate through the score_board
      score_board.forEach(function(user,user_index,ary) {
        if (user.username === username) { 
          console.log(user.username+" has been found")
          // now i need to increment polls_created for this element - should quit early from this loop
          user.polls_created++
        }
      })      
    }  
    
    var incrementPollsVoted = function(username) { // passed $scope.user.username
      console.log("User.incrementPollsVoted() invoked")
      stats.num_votes++
      user_lookup[username].polls_voted++ 
      // now need to change the score_board too
      
      // iterate through the score_board
      score_board.forEach(function(user,user_index,ary) {
        if (user.username === username) { 
          console.log(user.username+" has been found")
          // now i need to increment polls_voted for this element - should quit early from this loop
          user.polls_voted++
        }
      })      
    }
    
// Technically I should be using User.query() since I am getting all the users
// but I had problems with that method when I tried with Poll.query
    var all = function() {
      console.log("getUsers() invoked")
      if (cached_users === null) {
        cached_users = UsersResource.get( {} ).$promise
        .then(function(results) {
          console.log("getUsers() results")
          console.log(results)
          console.log("**** I AM GETTING ALL THE USERS FROM THE SERVER. ****")
          user_lookup = {}
          score_board = []
          stats       = {}
          stats.num_votes = 0
          stats.num_users = 0 // is this being used
          stats.num_users = results.data.length // note that with a lot of users, then this will no longer work
          results.data.forEach(function(user){
            // user_lookup provides a convenient way to get polls created and voted
            // when knowing the user's username. however there are problems using
            // a hash with ng-repeat and filters
            user_lookup[user.github.username] = {
              'displayName':   user.github.displayName,
              'polls_created': user.polls.num_created,
              'polls_voted':   user.polls.num_voted
            }
            // a separate array having all this information is useful when using
            // ng-repeat with filters for the scoreboard
            score_board.push({
              'username':      user.github.username,
              'displayName':   user.github.displayName,
              'polls_created': user.polls.num_created,
              'polls_voted':   user.polls.num_voted
            })
            stats.num_votes += user.polls.num_voted
            
          })
          console.log("score board")
          console.log(user_lookup)
    
          return {
            lookup:      user_lookup,
            score_board: score_board,
            stats:       stats
            
            /* num_votes:   num_votes, // returning a simple variable means that this is a value that is not mutable
            num_users:   num_users  // therefore now both of these are stored in stats */
          }
          
        })
      return cached_users // the else is not necessary, just return cached_users at the end
      } else { // if cached_users
        console.log("users retrieved locally from the users service.")
        return cached_users
      }
    }    
    
    return {
      all:        all,
      get:        get,
      decrementPollsCreated: decrementPollsCreated,
      incrementPollsCreated: incrementPollsCreated,
      incrementPollsVoted:   incrementPollsVoted
    };
    
  };
  
  var module = angular.module("pollOverflow");
  // register service with angular
  module.factory("User", User);
  
  
}());