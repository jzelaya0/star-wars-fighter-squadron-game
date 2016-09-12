// source/assets/js/controllers/profileCtrl.js
(function() {
  'use strict';

  angular
    .module('profileCtrl',[])
    .controller('profileController', function($scope, Auth, User){
      var vm = this;
      //Loading icon when page opens
      vm.loading = true;
      // Grab the user info to display
      // ******************************
      Auth.getUserProfileInfo()
        .then(function(result){
          User.getOneUser(result.data._id)
            .success(function(result){
              // remove loading spinner
              vm.loading = false;
              vm.userInfo = result;
              // Set readable dates here
              vm.userInfo.createdAt = convertDates(result.createdAt);
              vm.userInfo.updatedAt = convertDates(result.updatedAt);
            });
        });

    });

    // Date conversions
    // ******************************
    function convertDates(fecha){
      var date = new Date(fecha);
      var fullDate = date.toDateString();
      return fullDate;
    }

}());
