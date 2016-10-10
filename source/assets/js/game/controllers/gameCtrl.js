// source/assets/js/controllers/game/gameCtrl.js
(function() {
  'use strict';

  angular
    .module('gameCtrl',[])
    .controller('gameController', function($scope, User,Alerts,PlayerStats, deviceDetector){
      var vm = this;
      var main = $scope.main;
      vm.showStats = false;
      vm.showHowToPlay = false;
      vm.showGame = false;

      // Show game only on desktops
      // ******************************
      if (deviceDetector.isDesktop()) {
        vm.showGame = true;
      }


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

      // Toggle game instructions
      // ******************************
      vm.toggleHowToPlay = function(){
        vm.showHowToPlay = !vm.showHowToPlay;
      };
      // Save user's high score and kills
      // ******************************
      vm.saveStats = function(){
        var stats =  PlayerStats.getPlayerStats();
        if (stats === null) {
          Alerts.addAlert('danger', "Sorry pilot! No scores to save. Start Playing!");
        }else {
          User.editUser(main.user._id, vm.playerStats)
            .success(function(result){
              Alerts.addAlert('success', "Game scores have been saved!");
            });

        }

      };


    });

}());
