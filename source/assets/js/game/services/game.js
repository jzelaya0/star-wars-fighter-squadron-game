// source/assets/js/game/services/game.js
(function() {
  'use strict';

  angular
    .module('gameService', [])
    .factory('Game', function(){
      var game;
      var starfield;
      var player;
      var cursor;
      var bank;
      var gameFactory = {};
      var ACCELERATION = 700;
      var DRAG = 500;
      var MAX_SPEED = 400;

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

          // enable player movement
          game.physics.enable(player, Phaser.Physics.ARCADE);
          player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
          player.body.drag.setTo(DRAG, DRAG);
          // add controls for user
          cursor = game.input.keyboard.createCursorKeys();
      };

      gameFactory.update = function(){
        // Scroll the background
        starfield.tilePosition.y += 2;

        //Reset player and then check if there is any movement
        player.body.acceleration.x = 0;


        // move the player left or right
        if (cursor.left.isDown) {
          player.body.acceleration.x = -ACCELERATION;
        }else if (cursor.right.isDown) {
          player.body.acceleration.x = ACCELERATION;
        }

        // set boundries for player at screen edges
        if (player.x > game.width - 40) {
          player.x = game.width - 40;
          player.body.acceleration.x = 0;
        }
        if (player.x < 40) {
          player.x = 40;
          player.body.acceleration.x = 0;
        }

        // set the ships "banking" here
        bank = player.body.velocity.x / MAX_SPEED;
        player.scale.x = 1 - Math.abs(bank) / 10;
        player.angle = bank * 10;
      };

      return gameFactory;

    });
}());
