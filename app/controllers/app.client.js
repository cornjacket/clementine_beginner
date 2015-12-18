'use strict';

(function () {

   angular
      .module('pollPosition', ['ngResource', 'ngAnimate', 'ui.bootstrap', 'ngRoute'])
      .config(function($routeProvider, $locationProvider) {
        $routeProvider
          .when("/", {
             templateUrl: "public/main.html",
             controller: "mainController"
          })
          .when("/poll/:poll_id", {
             templateUrl: "public/poll.html",
             controller: "pollController"
          })
          .otherwise({redirect:"/"})
      })

   
})();