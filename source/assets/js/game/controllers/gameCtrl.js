// source/assets/js/controllers/game/gameCtrl.js
(function() {
  'use strict';

  angular
    .module('gameCtrl',[])
    .controller('gameController', function($scope, User,Alerts,PlayerStats){
      var vm = this;
      var main = $scope.main;
      vm.showStats = false;

      // Get player stats from local storage
      // ******************************
      vm.showStatsPanel = function(){
        // toggle pop up box
        vm.showStats = !vm.showStats;

        // Get stats from local storage
        vm.playerStats = PlayerStats.getPlayerStats();

        // If no score in storage, then display 0
        if(!vm.playerStats){
          vm.playerStats = {
            highestScore: 0,
            mostKills: 0
          };
        }
      };

      // Save user's high score and kills
      // ******************************
      vm.saveStats = function(){
        if (vm.playerStats) {
          User.editUser(main.user._id, vm.playerStats)
            .success(function(result){
              Alerts.addAlert('success', "Game scores have been saved!");
            });
        }

      };

    });

}());
