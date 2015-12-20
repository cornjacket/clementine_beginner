'use strict';

(function () {

   angular
      .module('pollPosition')
      .controller('mainController', ['$scope', '$resource', '$http', 'pollService', 'userService',
          function ($scope, $resource, $http, pollService, userService) {
         
        $scope.pollHeader = "All Polls"
        $scope.displayAllPolls = true
        $scope.num_polls       = 0 
        $scope.isLoggedIn      = false
        $scope.polls           = [] 
        
        console.log("CLIENT HAS STARTED")


        

        $scope.addOption = function () {
           console.log("$scope.addOption() invoked")
           console.log($scope.new_poll_indices)
           $scope.new_poll_indices.push($scope.next_poll_option++) 
        }
        
        var initOptions = function() {
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
     

        var getUser = function() {
          return userService.getUser().then(function(data){ // returned so that it can be then-able
              console.log("User results")
              console.log(data)
              $scope.name = (data.displayName !== null) ? data.displayName : data.username
              $scope.displayName = (data.displayName !== null) ? data.displayName : "none"
              $scope.id = data.id
              $scope.username = data.username
              $scope.publicRepos = data.publicRepos
              $scope.isLoggedIn = data.username !== undefined // testing - why is a html page being sent to client
              
              //console.log("isLoggedIn = "+$scope.isLoggedIn)
              //console.log("username = "+results.username)
              //console.log("name")
              //console.log($scope.name)
          })
        }        

        var getUsers = function() {
          return userService.getUsers().then(function(data) {
            $scope.user_lookup = data.user_lookup
            $scope.score_board = data.score_board
            $scope.num_users   = data.num_users
            $scope.num_votes   = data.num_votes
          })
        }

        var update_user_lookup = function() {
          // this will update the polls_created, poll_voted stars. I could just 
          // update the $scope.user_lookup directly inside vote and inside deletePoll which would be faster
          getUsers()  
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


  initOptions()
  getUsers() // this will give us all the users so we can build our create/vote hash
  getUser($scope.id).then(function() {
      pollService.getPolls($scope.id).then(function(polls){
          $scope.polls = polls
          $scope.num_polls = polls.length // this will need to be updated periodically
      })
  }); // logic inside of getPolls depends on getUser completing

  }]);
   
})();