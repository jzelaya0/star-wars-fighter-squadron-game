// source/assets/js/controllers/mainCtrl.js
(function() {
  'use strict';

  angular
    .module('mainCtrl',[])
    .controller('mainController', function($rootScope, Auth){
      var vm = this;

      // Check if user is logged in on each request
      // ******************************
      vm.isLoggedIn = Auth.isUserLoggedIn();

      $rootScope.$on('$stateChangeStart', function(){
        vm.isLoggedIn = Auth.isUserLoggedIn();
        Auth.getUserProfileInfo()
          .then(function(result){
            // bind user info to view model
            vm.user = result.data;
          });
      });

    });

}());
