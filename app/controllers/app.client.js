'use strict';

(function () {

   angular
      .module('pollOverflow', ['ngResource', 'ngAnimate', 'ui.bootstrap', 'ngRoute', "chart.js"])
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