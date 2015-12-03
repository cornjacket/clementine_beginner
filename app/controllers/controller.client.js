'use strict';

(function () {

   angular
      .module('clementineApp', ['ngResource'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {
         
        $scope.isLoggedIn      = false
        $scope.hasVotedForPoll = []
        
        //var Click = $resource('/api/clicks'); // instead of /api/:id/clicks since $resource ignores the :id in the middle


        var updateHasAlreadyVoted = function() {
            
            console.log("updateHasAlreadyVoted() invoked")
              $scope.polls.forEach(function(item,poll_index,ary) {
                console.log(item.poll.question)
                console.log(ary[poll_index].poll.question)
                var alreadyVoted = false
                
                console.log("Voting list")
                item.poll.votes.forEach(function(vote_ary, vote_index, parent_ary) {
                    console.log(vote_index+" "+vote_ary)
                    if (vote_ary.indexOf($scope.id) != -1) {
                        console.log("Found a vote. This has been already voted on.")
                        alreadyVoted = true
                    }
                })
                $scope.hasVotedForPoll[poll_index] = alreadyVoted // this should work out of the box
              })
              console.log("$scope.hasVotedForPoll")
              console.log($scope.hasVotedForPoll)
            
        }

        var User = $resource('/api/user/:id');
        /*angular.module('clementineApp.services').factory('User', function($resource) {
        return $resource('/api/:id'); // Note the full endpoint address
        });*/
     
        //var Poll = $resource('/api/polls'); // Note the NOT full endpoint address - working code for GET

        var Poll = $resource('/api/polls/:id', { id: '@_id' }, {
                     update: {
                       method: 'PUT' // this method issues a PUT request
                     }
                   })

     
        $scope.getUser = function () {
           console.log("clickController.client: getUser() invoked")
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
              
           })
        }
        
        $scope.getUser();

// Technically I should be using Poll.query() since I am getting all the polls, though my implementation does work.
// Something to refactor later. - but to make this change I believe that the Poll url should include :id
        $scope.getPolls = function() {
          console.log("clickController.client: getPolls() invoked")
          //Poll.get({ id: $scope.id }, function(results) { // there is no need for any id when grabbing all the polls
          Poll.get( {}, function(results) {
          //$scope.polls = Poll.query( function() { //(results) {
              $scope.polls = results.data
              // lets go through all the polls and see if the user has already voted by inspecting the votes
              updateHasAlreadyVoted()
              //console.log("Poll results")
              //console.log($scope.polls)
          })
        }
 
        // does this have to be invoked after getUser() ??       
        $scope.getPolls()

        $scope.vote = function(poll_number, option_number) {
          console.log("You just voted")
          $scope.polls[poll_number].poll.votes[option_number].push($scope.id)
          console.log("You just voted for poll "+poll_number+" option "+option_number)
          $scope.hasVotedForPoll[poll_number] = true
          ////////////// BUT IT NEEDS TO PERSIST TO THE DATABASE
          console.log($scope.hasVotedForPoll)
        }

      }]);
   
})();