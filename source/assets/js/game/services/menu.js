// source/assets/js/game/services/menu.js

(function() {
  'use strict';

  angular.module('gameMenuService',[])
  .factory('menuState', function(){
    var menuFactory = {};

    // Main menu
    // ******************************
    menuFactory.create = function(game){

        //Game title
        var nameLabel = game.add.text(game.world.centerX, 250, 'Star Wars\nFighter Squadron', {
          font: '50px Arial',
          fill: '#ffc107'
        });

        // Instructions to start game
        var startLabel = game.add.text(game.world.centerX, game.world.height - 80, 'Press "Enter" to start', {
          font: '20px Arial',
          fill: '#ddd'
        });

        // Center game title and instructions
        nameLabel.anchor.set(0.5);
        nameLabel.align = 'center';
        startLabel.anchor.set(0.5);

        // key press to start game
        var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        enterKey.onDown.addOnce(start, this);

        //start the game
        function start(){
          return game.state.start('play');
        }

    };

    return menuFactory;
  });
}());
