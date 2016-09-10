// source/assets/js/game/services/playerStats.js

(function() {
  'use strict';

  angular
    .module('playerStatsService', [])
    .factory('PlayerStats', function($window){
      var playerStatsFactory = {};
      var PLAYER_STATS = 'playerStats';

      // Set player stats in local storage
      // ******************************
      playerStatsFactory.setPlayerStats = function(stats){
        var storageStats = this.getPlayerStats();
        // Only set if score and kills are highter
        if (storageStats === null || stats.highestScore > storageStats.highestScore || stats.mostKills > storageStats.mostKills) {
          $window.localStorage.setItem(PLAYER_STATS, JSON.stringify(stats));
        }
      };

      // Get player stats in local storage
      // ******************************
      playerStatsFactory.getPlayerStats = function(){
        var playerStats = $window.localStorage.getItem(PLAYER_STATS);

        return JSON.parse(playerStats);
      };

      // Delete player stats in local storage
      // ******************************
      playerStatsFactory.removePlayerStats = function(){
        $window.localStorage.removeItem(PLAYER_STATS);
      };

      return playerStatsFactory;
    });
}());
