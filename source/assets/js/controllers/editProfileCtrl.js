// source/assets/js/controllers/editProfileCtrl.js
(function() {
  'use strict';

  angular
    .module('editProfileCtrl', [])
    .controller('editProfileController', function(User,Alerts, $stateParams){
      var vm = this;
      vm.isCollapsed = true;

      // Edit user info
      // ******************************
      vm.submitForm = function(editForm){
        User.editUser($stateParams.userId,vm.editInfo)
          .success(function(result){
            if (result.message === 'success') {
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


    });


}());
