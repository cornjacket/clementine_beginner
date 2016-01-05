'use strict';

(function () {

   angular
      .module('pollOverflow', ['ngResource', 'ngAnimate', 'ui.bootstrap', 'ngRoute', "chart.js"])
      .config(function($routeProvider, $locationProvider) {
        $routeProvider
          .when("/", {
             templateUrl: "public/main.html",
             controller: "mainController",
             /* DRT
             resolve: {
                 data: function($q, User, Poll) {
                     var defer = $q.defer()
                      User.all()
                      User.get().then(function(user) {
                        Poll.getPolls(user).then(function(polls){
                              defer.resolve()
                          })
                      })                     
                     return defer.promise
                 }
             }*/
          })
          .when("/poll/:poll_id", {
             templateUrl: "public/pollShow.html",
             controller: "pollController"
          })
          .otherwise({redirect:"/"})
      })

   
})();