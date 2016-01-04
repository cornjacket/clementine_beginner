'use strict';

(function () {

  angular
    .module('pollOverflow')
    .controller('loginController', ['$scope', 'User', function ($scope, User) {
      $scope.user = {}
        console.log("LOGIN CLIENT HAS STARTED")
        User.get().then(function(user) {
          $scope.user = user
      })

    }]);
   
})();