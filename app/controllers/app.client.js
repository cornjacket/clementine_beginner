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
                 data: function($q, $timeout, User, Poll) {
                     var defer = $q.defer()
                      User.all()
                      User.get().then(function(user) {
                        Poll.getPolls(user).then(function(polls){
                              defer.resolve()
                          })
                      })                     
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