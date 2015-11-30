'use strict';

(function () {

   angular
      .module('clementineApp', ['ngResource'])
      .controller('clickController', ['$scope', '$resource', function ($scope, $resource) {
         
        var Click = $resource('/api/clicks'); // instead of /api/:id/clicks since $resource ignores the :id in the middle


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