// Change some things in this code to be different from clientController

'use strict';

(function () {

   angular
      .module('pollOverflow')
      .controller('pollController', ['$scope', '$resource', '$http', '$routeParams', '$timeout', 
        '$location', 'Poll', 'User',
        function ($scope, $resource, $http, $routeParams, $timeout, $location, Poll, User) {
         
        $scope.pollHeader = "Poll Detail"
        $scope.displayAllPolls = true
        $scope.users           = {}
        $scope.num_polls       = 0 
        $scope.poll            = {}
        $scope.displayBarGraph =true
        var polls              = [] 

        console.log("CLIENT HAS STARTED")

////////////////////////////////////////////     
     
     var clear_graph = function() {
       $scope.labels = [ "" ] // This message pops up over the bar graph on hover
       $scope.pie_labels = []
       $scope.series = []
       $scope.data = []
       $scope.pie_data = []
     }
     
     $scope.initGraph = function() {
     
        clear_graph()
        // label can be the questions
        // take $scope.poll and iterate through each of the options
        console.log("pollController: init_graph() invoked")
        console.log($scope.poll)
        $scope.poll.item.poll.options.forEach(function(option) {
          $scope.series.push(option)
          $scope.pie_labels.push(option)
        })
        $scope.poll.aggregate_votes.forEach(function(votes) {
          $scope.data.push([ votes ])
          $scope.pie_data.push( votes )
        })
        $scope.onClick = function (points, evt) {
          console.log(points, evt);
        };
      
     }

      var getUsers = function() {
        return User.all().then(function(data) {
          $scope.users = data
        })
      }
      
      $scope.redirectToRoot = function() {
        $location.path('/')
      }

      var setCurrentPoll = function(){
        console.log("findCurrentPoll() invoked")
        console.log(polls)
        polls.forEach(function(poll,poll_index,ary) {
          console.log("XXX "+$routeParams.poll_id+" vs "+poll.item._id)
          
          if (poll.item._id === $routeParams.poll_id) { 
            $scope.poll = poll // = item
          }
        })

      }

////////////////////////////////////////////
      getUsers() // used for lookup table
      User.get().then(function(user) { // needed if index.html loginController is not on body
        $scope.user = user
        console.log("USER")
        console.log(user)
        console.log($scope.users)
        Poll.getPolls(user).then(function(_polls){
          console.log("POLL CALLED IN CONTROLLER")
          polls = _polls
          $scope.num_polls = polls.length // this will need to be updated periodically
          setCurrentPoll()
          $scope.initGraph()
        })
      })
        

    }]);
   
})();