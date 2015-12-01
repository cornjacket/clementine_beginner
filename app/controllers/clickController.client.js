'use strict';

(function () {

   angular
      .module('clementineApp', ['ngResource'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {
         
        $scope.isLoggedIn = false 
         
        //var Click = $resource('/api/clicks'); // instead of /api/:id/clicks since $resource ignores the :id in the middle

        var User = $resource('/api/user/:id');
        /*angular.module('clementineApp.services').factory('User', function($resource) {
        return $resource('/api/:id'); // Note the full endpoint address
        });*/
     
        var Poll = $resource('/api/polls');
     
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

/*
        $scope.getClicks = function () {
          console.log("clickController.client: getClicks() invoked")
          Click.get(function (results) {
           
           console.log(results.clicks)
           $scope.clicks = results.clicks;
          });
        };

        $scope.getClicks();
*/
 
        $scope.getPolls = function() {
          console.log("clickController.client: getPolls() invoked")
          //Poll.get({ id: $scope.id }, function(results) { // there is no need for any idea when grabbing all the polls
          Poll.get( {}, function(results) {
              console.log("Poll results")
              console.log(results)
              $scope.polls = results.data
          })
        }
 
        // does this have to be invoked after getUser() ??       
        $scope.getPolls()

/*
         $scope.addClick = function () {
            Click.save(function () {
               $scope.getClicks();
            });
         };
         
         $scope.resetClicks = function () {
            Click.remove(function () {
               $scope.getClicks();
            });
         };   
*/   

         $scope.vote = function() {
             console.log("You just voted")
         }

      }]);

      
      
   
})();