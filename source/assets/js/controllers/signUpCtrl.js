// source/assets/js/controllers/signUpCtrl.js
(function() {
  'use strict';

  angular
    .module('signUpCtrl', [])
    .controller('signUpController', function($location, User, Alerts){
      var vm = this;
      vm.isLoading = false;

      // Create a new user
      // ******************************
      vm.signUp = function(signupForm){
        // show loading spinner
        vm.isLoading = true;
        // sign up request
        User.createUser(vm.signUpData)
          .success(function(result){
            // add to result messages
            var taken = " - Already taken!";

            // Successful sign up
            if(result.success === true){
              Alerts.addAlert('success', result.message);
              $location.path('/login');
            // If both username and email are taken
            }else if (result.email_error && result.username_error) {
              Alerts.addAlert('danger', result.email_error.value + " & " + result.username_error.value + taken);
              console.log(result.email_error, result.username_error);
            // If either username or email is taken
            }else if(result.email_error || result.username_error){
              var error = result.email_error || result.username_error;
              Alerts.addAlert('warning', error.value + taken);
            }

            // Clear validation errors
            signupForm.$setPristine();
            // Clear the form on submit
            vm.signUpData = {};
            // remove loading spinner
            vm.isLoading = false;

          });
      };

    });
}());
