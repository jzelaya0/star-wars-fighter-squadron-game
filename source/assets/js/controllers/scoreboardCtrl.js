// source/assets/js/controllers/scoreboardCtrl.js
(function() {
  'use strict';

  angular
    .module('scoreboardCtrl', [])
    .controller('scoreboardController', function(User){
      var vm = this;
      vm.loading = true;

      // Get all users on page load
      User.getAllUsers()
        .success(function(result){
          vm.users = result;
          vm.loading = false;
        });

    });
}());
