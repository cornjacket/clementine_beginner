'use strict';

(function () {

   angular
      .module('pollOverflow', ['ngResource', 'ngAnimate', 'ui.bootstrap', 'ngRoute', "chart.js"])
      .config(function($routeProvider, $locationProvider) {
        $routeProvider
          .when("/", {
             templateUrl: "public/main.html",
             controller: "mainController",
             resolve: {
                 data1: function($q, $timeout, User, Poll) {
                     var defer = $q.defer()
                      
                      
                      //User.all() //.then(Poll.getPolls({})).then(defer.resolve) //getPolls should have a user parameter - this may not work right
                     
//getUsers() // user_lookup/score_board

  User.get().then(function(user) { // needed if index.html loginController is not on body
   // $scope.user = user 
    User.all()
    console.log("DAVE TESTING POST USER.GET")
    Poll.getPolls(user).then(function(polls){
         // $scope.polls = polls
          //$scope.num_polls = polls.length // this will need to be updated periodically
          console.log("DAVE TESTING Defer.resolve HERE")
          //console.log($scope.polls)
          //$scope.currentpoll = $scope.polls[3] // this should be removed after i fix this bug
          //console.log($scope.currentpoll)
          defer.resolve()
      })
  })                     
                     
                     
                     //$timeout(function() {
                     //    defer.resolve()
                     //    console.log("RESOLVE finished")
                     //}, 10000)
                     //
                     console.log("DAVID: RETURN DEFERRED PROMISE")
                     return defer.promise
                 }
             }
          })
          .when("/poll/:poll_id", {
             templateUrl: "public/poll.html",
             controller: "pollController"
          })
          .otherwise({redirect:"/"})
      })

   
})();