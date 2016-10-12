// source/assets/js/controllers/loginCtrl.js
(function() {
  'use strict';

  angular
    .module('loginCtrl',[])
    .controller('loginController', function($rootScope, $location, Auth, Alerts){
      var vm = this;
      vm.isLoading = false;

      // Log User in
      // ******************************
      vm.login = function(){
        // show loader on click
        vm.isLoading = true;
        // login request
        Auth.logUserIn(vm.loginData.username, vm.loginData.password)
          .success(function(result){
            if(result.success){
              // Send user to the game page
              $location.path('/game');
            }else {
              //Bind error message to global alerts
              Alerts.addAlert("danger", result.message);
            }

            //hide loader
            vm.isLoading = false;
          });
      };

      // Log User out
      // ******************************
      vm.logout = function(){
        Auth.logUserOut();{
          // send user to root page
          $location.path('/');
        }
      };
    });// end loginController

}());
