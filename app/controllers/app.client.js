'use strict';

(function () {

   angular
      .module('pollPosition', ['ngResource', 'ngAnimate', 'ui.bootstrap', 'ngRoute'])
      .config(function($routeProvider, $locationProvider) {
        $routeProvider
          .when("/", {
             templateUrl: "public/main.html",
             controller: "clientController"
          })
          .when("/poll/:id", {
             templateUrl: "public/poll.html",
             controller: "clientController"
          })
          .otherwise({redirect:"/"})
      })

   
})();