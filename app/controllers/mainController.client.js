'use strict';

(function () {


   angular
      .module('pollOverflow')
      .directive('dtPollTile', function() {
        return {
          templateUrl: "public/pollTile.html",
          restrict:    "E",
          scope:       { 
            poll: '=',
            user: '=' , // same as below
            users: '=', // should i pass this in or have the directive use the users service
            displayAllPolls: '=',
            deletableState: '@deletable',
            postDelete: '&', // this looks pretty ugly to me
            postVote: '&'
          },
          controller:  function($scope, Poll, User) {
            
            $scope.deletable = ($scope.deletableState === 'true')
            
            $scope.removing = false
            $scope.startRemoving = function() {
              $scope.removing = true
            }
            $scope.cancel = function() {
              $scope.removing = false
            }
            
            $scope.vote = function(poll, option_number) {       
              console.log("mainController: vote() invoked, using id = "+$scope.user.id) // id on the parameter list
              console.log("user.isLoggedIn = "+$scope.user.isLoggedIn)
              var id = ($scope.user.isLoggedIn) ? $scope.user.id : $scope.user.ip
              Poll.vote(poll, option_number, id)
                .then(function() {
                  if ($scope.user.isLoggedIn) {
                    User.incrementPollsVoted($scope.user.username) // update score_board/user_lookup
                    console.log("INVOKE VOTE")
                    //if ($scope.postVote) $scope.postVote()
                  } 
                  if ($scope.postVote) $scope.postVote()
                })
              }

            $scope.deletePoll = function(poll) {
              Poll.deletePoll(poll, $scope.user.id) // should this be a User.get_id
                .then(function() {
                  User.decrementPollsCreated($scope.user.username) // update score_board/user_lookup
                  console.log("INVOKE DELETEPOLL")
                  // why does this have to be on scope, doesnt seem like its the right way
                  if ($scope.postDelete) $scope.postDelete()
                })
              }
              
          }
        }
      })

   angular
      .module('pollOverflow')
      .directive('dtScoreBoard', function() {
        return {
          templateUrl: "public/scoreBoard.html",
          restrict:    "E",
          controller:  function($scope) {
            
            console.log("Inside dtScoreBoard controller")
            console.log($scope.myfield)
          
          },
          scope:       { 
            users: '=', // should i pass this in or have the directive use the users service
            mytitle: '@mytitle',
            myheading: '@myheading',
            myfield: '=myfield'
          }
          
        }
      })

   angular
      .module('pollOverflow')
      .directive('dtNewPoll', function() {
        return {
          templateUrl: "public/newPoll.html",
          restrict:    "E",
          controller:  function($scope, $location, Poll, User) {
           
            $scope.addOption = function () {
              console.log("$scope.addOption() invoked")
              console.log($scope.new_poll_indices)
              $scope.new_poll_indices.push($scope.next_poll_option++) 
            }
        
            var initOptions = function() {
             console.log("initOptions() invoked")
               $scope.new_poll_indices = [ 0, 1 ] // couldnt i just use $index
               $scope.next_poll_option = 2
               $scope.newPoll = {}
               $scope.newPoll.isOpen = false
               $scope.newPoll.option = []
            }

            $scope.cancelNewPoll = function() {
              console.log("$scope.cancelNewPoll() invoked")
              initOptions()
              $scope.isCollapsed = true
              console.log($scope.new_poll_indices)
              console.log($scope.option)
            }

            $scope.submitPoll = function() {
              console.log("submitPoll() invoked")
              console.log($scope.newPoll)
              console.log("pollIsOpen = "+$scope.newPoll.isOpen)
              
              console.log($scope.newPoll.question)
              console.log($scope.newPoll.option)
              $scope.newPoll.option.forEach(function(option) {
                console.log(option)
              })
              console.log($scope.newPoll.tags)
              
              
              if ($scope.newPoll.question !== undefined && $scope.newPoll.option.length !== 0 && $scope.newPoll.tags !== undefined) {
                $scope.isCollapsed = true
                // update User's lookup and scoreboard
                User.incrementPollsCreated($scope.user.username)
                // then go ahead and post the poll
                Poll.createPoll($scope.newPoll,$scope.user).then(function(result) {
                  console.log("Poll.createPoll() invoked in mainController")
                  //console.log(result)
                  initOptions() // not actually necessary since we are changing controllers
                  // change the path
                  $location.path('/poll/'+result._id)
                })            
              }
            }
           
            initOptions()
          }
        }
      })



   angular
      .module('pollOverflow')
      .controller('mainController', ['$scope', '$resource', '$http', '$location', 'Poll', 'User',
          function ($scope, $resource, $http, $location, Poll, User) {
         
        $scope.pollHeader = "All Polls"
        $scope.displayAllPolls = true
        $scope.users           = {}
        $scope.num_polls       = 0 
        $scope.polls           = [] 
        $scope.currentpoll     = null
        $scope.currentScoreBoard = null
        
        console.log("CLIENT HAS STARTED")
     
        var getUsers = function() {
          return User.all().then(function(data) {
            $scope.users = data
            console.log("mainController")
            console.log("num_votes = "+$scope.users.stats.num_votes) // DRT this does not get updated
          })
        }


        $scope.redirectToPollShow = function(poll_id) {
          console.log("redirectToPollShow")
          console.log(poll_id)
          $location.path('/poll/'+poll_id)
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


  console.log("mainController has started")
  getUsers() // user_lookup/score_board

  User.get().then(function(user) { // needed if index.html loginController is not on body
  
    $scope.user = user   
    Poll.getPolls(user).then(function(polls){
          $scope.polls = polls
          $scope.num_polls = Poll.info.num_polls  //polls.length // this will need to be updated periodically
          //console.log("DAVE TESTING DIRECTIVES HERE")
          //console.log($scope.polls)
          $scope.currentpoll = $scope.polls[3] // this should be removed after i fix this bug
          console.log($scope.currentpoll)
      })
  })
  


  }]);
   
})();