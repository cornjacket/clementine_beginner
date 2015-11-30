'use strict';

(function () {

   angular
      .module('clementineApp', ['ngResource'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {
         
        var Click = $resource('/api/clicks'); // instead of /api/:id/clicks since $resource ignores the :id in the middle

        var User = $resource('/api/user/:id');
        /*angular.module('clementineApp.services').factory('User', function($resource) {
        return $resource('/api/:id'); // Note the full endpoint address
        });*/
        
        $scope.getUser = function () {
           console.log("clickController.client: getUser() invoked")
           User.get({ id: $scope.id }, function (results) {
              console.log("results")
              console.log(results)
              $scope.name = (results.displayName !== null) ? results.displayName : results.username
              $scope.displayName = (results.displayName !== null) ? results.displayName : "none"
              $scope.id = results.id
              $scope.username = results.username
              $scope.publicRepos = results.publicRepos
              console.log("name")
              console.log($scope.name)
              
           })
        }
        
        $scope.getUser();

        $scope.getClicks = function () {
          console.log("clickController.client: getClicks() invoked")
          Click.get(function (results) {
           
           console.log(results.clicks)
           $scope.clicks = results.clicks;
          });
        };

        $scope.getClicks();

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
      }]);

      
      
   
})();