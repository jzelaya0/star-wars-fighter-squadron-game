// source/assets/js/controllers/editProfileCtrl.js
(function() {
  'use strict';

  angular
    .module('editProfileCtrl', [])
    .controller('editProfileController', function(User,Alerts, $location, $stateParams){
      var vm = this;
      vm.isCollapsed = true;
      vm.toggleDelete = false;

      // Edit user info
      // ******************************
      vm.submitForm = function(editForm){
        User.editUser($stateParams.userId,vm.editInfo)
          .success(function(result){
            if (result.success === true) {
              Alerts.addAlert('success', result.message);
              console.log(result);
            }else {
              Alerts.addAlert('danger',"Oops! Something went wrong...");
            }
            // Remove errors
            editForm.$setPristine();
            // Clear the form
            vm.editInfo = {};
          });
      };

      // Delete user account
      // ******************************
      vm.deleteAccount = function(){
        User.deleteUser($stateParams.userId)
          .success(function(result){
            if(result.success === true){
              Alerts.addAlert('success', result.message);
              // Redirect to home page
              $location.path('/home');
            }else {
              Alerts.addAlert('danger', 'Hmm... Something is not right.');
            }
          });
      };



    });


}());
