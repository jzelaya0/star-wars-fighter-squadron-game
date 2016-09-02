// source/assets/js/game/services/game.js

(function() {
  'use strict';

  angular
    .module('gameService', [])

    .factory('Game', function(bootState, loadState, menuState, playState){
      var gameFactory = {};
        // initialize game
        gameFactory.init = function(game){
          game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameCanvas');

          // Set game states
          game.state.add('boot', bootState);
          game.state.add('load', loadState);
          game.state.add('menu', menuState);
          game.state.add('play', playState);

          // start game once all state are added
          game.state.start('boot');

        };

      // return game factory
      return gameFactory;
    });

}());
