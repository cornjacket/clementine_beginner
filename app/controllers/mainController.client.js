'use strict';

(function () {

   angular
      .module('pollPosition')
      .controller('mainController', ['$scope', '$resource', '$http', 'pollService',
          function ($scope, $resource, $http, pollService) {
         
        $scope.pollHeader = "All Polls"
        $scope.displayAllPolls = true
        $scope.num_polls       = 0 
        $scope.isLoggedIn      = false
        $scope.polls           = [] 
        
        console.log("CLIENT HAS STARTED")


        var User = $resource('/api/user/:id');

        var Users = $resource('/api/users/:id'); // I need to revisit why this behavior is happening. Maybe inspect mean.js code

        $scope.addOption = function () {
           console.log("$scope.addOption() invoked")
           console.log($scope.new_poll_indices)
           $scope.new_poll_indices.push($scope.next_poll_option++) 
        }
        
        $scope.initOptions = function() {
          console.log("$scope.initOptions() invoked")
          $scope.new_poll_indices = [ 0, 1 ]
          $scope.next_poll_option = 2
          $scope.question         = "here is the question"
          //$scope.option = []
          
        }

        $scope.cancelNewPoll = function() {
          console.log("$scope.cancelNewPoll() invoked")
          $scope.initOptions()
          $scope.isCollapsed = true
          console.log($scope.new_poll_indices)
          console.log($scope.option)
        }
     
        // first time getUser is called it returns nothing
        // i see a strange response when id is undefined but i dont see a match
        // in the server console to get user
        $scope.getUser = function (callback) {
           console.log("getUser() invoked")
           console.log("GETUSER() $scope.id = "+$scope.id)
           User.get({ id: $scope.id }, function (results) {  // dont think scope.id is really necessary here. Remove and see what happens
              console.log("User results")
              console.log(results)
              $scope.name = (results.displayName !== null) ? results.displayName : results.username
              $scope.displayName = (results.displayName !== null) ? results.displayName : "none"
              $scope.id = results.id
              $scope.username = results.username
              $scope.publicRepos = results.publicRepos
              $scope.isLoggedIn = results.username !== undefined // testing - why is a html page being sent to client
              

              console.log("isLoggedIn = "+$scope.isLoggedIn)
              console.log("username = "+results.username)
              console.log("name")
              console.log($scope.name)
              callback()
              
           })
        }
        


// Technically I should be using User.query() since I am getting all the users
// but I had problems with that method when I tried with Poll.query
        $scope.getUsers = function() {
          console.log("getUsers() invoked")
          Users.get( {}, function(results) {
              console.log("getUsers() results")
              console.log(results)
              $scope.user_lookup = {}
              $scope.score_board = []
              $scope.num_users   = 0
              $scope.num_votes   = 0
              $scope.num_users = results.data.length // note that with a lot of users, then this will no longer work
              results.data.forEach(function(user){
                // user_lookup provides a convenient way to get polls created and voted
                // when knowing the user's username. however there are problems using
                // a hash with ng-repeat and filters
                $scope.user_lookup[user.github.username] = {
                  'displayName':   user.github.displayName,
                  'polls_created': user.polls.num_created,
                  'polls_voted':  user.polls.num_voted
                }
                // a separate array having all this information is useful when using
                // ng-repeat with filters for the scoreboard
                $scope.score_board.push({
                  'username':      user.github.username,
                  'displayName':   user.github.displayName,
                  'polls_created': user.polls.num_created,
                  'polls_voted':  user.polls.num_voted
                })
                $scope.num_votes += user.polls.num_voted
              })
              console.log("score board")
              console.log($scope.user_lookup)
        
              
          })
        }

        var update_user_lookup = function() {
          // this will update the polls_created, poll_voted stars. I could just 
          // update the $scope.user_lookup directly inside vote and inside deletePoll which would be faster
          $scope.getUsers()  
        }

        $scope.vote = function(poll, option_number) {
          console.log("mainController: vote() invoked, using id = "+$scope.id)
          pollService.vote(poll, option_number, $scope.id)
          .then(update_user_lookup)
        }

        $scope.deletePoll = function(poll) {
          pollService.deletePoll(poll, $scope.id)
          .then(update_user_lookup)
        }



/*
FOR NOW REMOVE VOTE() AND DELETE(). THIS SHOULD BE MOVED INTO THE SERVICE. BUT THEN I NEED TO MODIFY POLLS IN
BOTH CONTROLLER AND IN THE SERVICE. SEEMS QUIRKY.

        $scope.deletePoll = function(poll) {
            // need a safety precaution to check if user is author of poll to delete
            if ($scope.id === poll.item.author.github_id) {
            // i could also put up a pop up confirming the deletion - not sure - see angular directives video
            console.log("deletePoll() invoked")
            poll.isPollDeleted = true
            $scope.num_polls--
            Poll.delete({ id:poll.item._id }, update_user_lookup);   
            } else {
                // I can envision this happening while using $index
                console.log("ERROR: deletePoll. Trying to delete a poll by non-author")
                console.log($scope.id)
                console.log(poll.item.author.github_id)
            }
        }
*/

/////////////////////////////

  $scope.items = ['Item 1', 'Item 2', 'Item 3']; // this can be removed

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.oneAtATime = true;


  $scope.status = {
    isopen: false
  };

  $scope.isCollapsed = true;


  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };
  
  $scope.setAllPolls = function(displayAllPolls) {
      // either display All Polls or My Polls
      console.log("setAllPolls() invoked")
      $scope.pollHeader = (displayAllPolls) ? "All Polls" : "My Polls"
      $scope.displayAllPolls = displayAllPolls
  }



        $scope.initOptions()
        $scope.getUsers() // this will give us all the users so we can build our create/vote hash
        $scope.getUser(function() {
          pollService.getPolls($scope.id).then(function(polls){
            $scope.polls = polls
            $scope.num_polls = polls.length // this will need to be updated periodically
          })
        }); // logic inside of getPolls depends on getUser completing

      }]);
   
})();