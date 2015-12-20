(function() {
  var User = function($resource) {
    
    var UserResource = $resource('/api/user/:id');
    var UsersResource = $resource('/api/users/:id'); // I need to revisit why this behavior is happening. Maybe inspect mean.js code


        // first time getUser is called it returns nothing
        // i see a strange response when id is undefined but i dont see a match
        // in the server console to get user
        var get = function (id) { // dont believe id is used or needed
           console.log("getUser() invoked")
           console.log("GETUSER() id = "+id)
           return UserResource.get({ id: id }).$promise  // dont believe the actual value of id has meaning
             .then(function(results) {
               var user = {}             
               user.name = (results.displayName !== null) ? results.displayName : results.username
               user.displayName = (results.displayName !== null) ? results.displayName : "none"
               user.id = results.id
               user.username = results.username
               user.publicRepos = results.publicRepos
               user.isLoggedIn = results.username !== undefined // testing - why is a html page being sent to client
               return user
             })
        }

// Technically I should be using User.query() since I am getting all the users
// but I had problems with that method when I tried with Poll.query
    var all = function() {
      console.log("getUsers() invoked")
      return UsersResource.get( {} ).$promise
        .then(function(results) {
          console.log("getUsers() results")
          console.log(results)
          var user_lookup = {}
          var score_board = []
          var num_votes   = 0
          var num_users = results.data.length // note that with a lot of users, then this will no longer work
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
            num_votes += user.polls.num_voted
          })
          console.log("score board")
          console.log(user_lookup)
    
          return {
            lookup:      user_lookup,
            score_board: score_board,
            num_votes:   num_votes,
            num_users:   num_users
          }
          
      })
    }    
    

    return {
      all: all,
      get:  get
      
    };
    
  };
  
  var module = angular.module("pollPosition");
  // register service with angular
  module.factory("User", User);
  
  
}());