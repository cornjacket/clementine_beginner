'use strict';

(function () {

   angular
      .module('pollPosition')
      .controller('mainController', ['$scope', '$resource', '$http', 'Poll', 'User',
          function ($scope, $resource, $http, Poll, User) {
         
        $scope.pollHeader = "All Polls"
        $scope.displayAllPolls = true
        $scope.users           = {}
        $scope.num_polls       = 0 
        $scope.polls           = [] 
        
        console.log("CLIENT HAS STARTED")
        
        $scope.addOption = function () {
           console.log("$scope.addOption() invoked")
           console.log($scope.new_poll_indices)
           $scope.new_poll_indices.push($scope.next_poll_option++) 
        }
        
        var initOptions = function() {
          console.log("initOptions() invoked")
          $scope.new_poll_indices = [ 0, 1 ]
          $scope.next_poll_option = 2
          $scope.question         = "here is the question"
          //$scope.option = []
          
        }

        $scope.cancelNewPoll = function() {
          console.log("$scope.cancelNewPoll() invoked")
          initOptions()
          $scope.isCollapsed = true
          console.log($scope.new_poll_indices)
          console.log($scope.option)
        }
     
        var getUsers = function() {
          return User.all().then(function(data) {
            $scope.users = data
          })
        }

        $scope.vote = function(poll, option_number) {
          console.log("mainController: vote() invoked, using id = "+$scope.id) // id on the parameter list
          Poll.vote(poll, option_number, $scope.user.id)
          .then(function() {
            User.incrementPollsVoted($scope.user.username) // update score_board/user_lookup
          })
        }

        $scope.deletePoll = function(poll) {
          Poll.deletePoll(poll, $scope.user.id)
          .then(function() {
            User.decrementPollsCreated($scope.user.username) // update score_board/user_lookup
          })
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
      $scope.userHasNoPolls = ($scope.users.lookup[$scope.user.username].polls_created <= 0)
      console.log("setAllPolls() : polls created by user = "+ $scope.users.lookup[$scope.user.username].polls_created)
  }


  initOptions()
  getUsers() // user_lookup/score_board

  User.get().then(function(user) { // needed if index.html loginController is not on body
    $scope.user = user   
    Poll.getPolls(user).then(function(polls){
          $scope.polls = polls
          $scope.num_polls = polls.length // this will need to be updated periodically
      })
  })


  }]);
   
})();