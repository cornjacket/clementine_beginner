// Change some things in this code to be different from clientController

'use strict';

(function () {

   angular
      .module('pollPosition')    // providers removed since now this is a reference
      .controller('pollController', ['$scope', '$resource', '$http', '$routeParams', '$timeout', 'Poll', 'User',
        function ($scope, $resource, $http, $routeParams, $timeout, Poll, User) {
         
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
       $scope.labels = []
       $scope.pie_labels = ["hi","bye"]
       $scope.series = []
       $scope.data = []
       $scope.pie_data = [0, 0]
     }
     
     var init_graph = function() {
     
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
        
        var update_user_lookup = function() {
          // this will update the polls_created, poll_voted stars. I could just 
          // update the $scope.user_lookup directly inside vote and inside deletePoll which would be faster
          getUsers()  
        }
        
        $scope.vote = function(poll, option_number) {
          console.log("mainController: vote() invoked, using id = "+$scope.id) // id on the parameter list
          Poll.vote(poll, option_number, $scope.user.id)
          .then(function() {
            update_user_lookup()
            init_graph()
          })
        }

        $scope.deletePoll = function(poll) {
          Poll.deletePoll(poll, $scope.user.id) // should be on the parameter list
          .then(function() {
            update_user_lookup() // this is not really needed since there will be nothing to look up
            clear_graph() // this isn't removing the graph
            console.log("HEY, THIS JUST GOT INVOKED")
          })
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
        getUsers()
        User.get().then(function(user) { // needed if index.html loginController is not on body
          $scope.user = user   
          Poll.getPolls(user).then(function(_polls){
            polls = _polls
            $scope.num_polls = polls.length // this will need to be updated periodically
            setCurrentPoll()
            init_graph()
          })
        })
        

      }]);
   
})();