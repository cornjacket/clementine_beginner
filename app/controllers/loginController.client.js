'use strict';

(function () {

   angular
      .module('pollPosition')
      .controller('loginController', ['$scope', 'User',
          function ($scope, User) {
         
        //$scope.pollHeader = "All Polls"
        //$scope.displayAllPolls = true
        //$scope.users           = {}
        //$scope.num_polls       = 0 
        //$scope.user.isLoggedIn = false // will this generate an error
        //$scope.polls           = [] 
        
        $scope.user = {}
        
        console.log("LOGIN CLIENT HAS STARTED")
  
        User.get().then(function(user) {
          $scope.user = user
        })


  }]);
   
})();