// source/assets/js/game/services/game.js
(function() {
  'use strict';

  angular
    .module('gameService', [])
    .factory('Game', function(){
      var game;
      var starfield;
      var player;
      var gameFactory = {};

      gameFactory.init = function(){
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameCanvas', {
          preload: this.preload, create: this.create , update: this.update
        });
      };

      gameFactory.preload = function(){
          // load image assets
          game.load.image('x-wing', '../assets/images/x-wing-pixel.png');
          game.load.image('tie-fighter', '../assets/images/tie-fighter-pixel.png');
          game.load.image('starfield', '../assets/images/background.jpg');
      };


      gameFactory.create = function(){
          var world = game;

          // add scrolling space background
          starfield = game.add.tileSprite(0, 0, world.width, world.height, 'starfield');

          // set player as xwing pilot
          player =  game.add.sprite(400,500, 'x-wing');
          player.anchor.setTo(0.5,0.5);
      };

      gameFactory.update = function(){
        // Scroll the background
        starfield.tilePosition.y += 2;
      };

      return gameFactory;

    });
}());
