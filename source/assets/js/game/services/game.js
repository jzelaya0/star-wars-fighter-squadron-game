// source/assets/js/game/services/game.js

// TODO: Clean up code and modularize once game
// functionality is up and running
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
      var xwingLaser;
      var fireRate = 100;
      var fireButton;
      var nextFire = 0;
      var gameFactory = {};
      var LASER_VELOCITY = 700;
      var ACCELERATION = 700;
      var DRAG = 500;
      var MAX_SPEED = 400;


      // Initialize game
      // ******************************
      gameFactory.init = function(){
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameCanvas', {
          preload: this.preload, create: this.create , update: this.update
        });
      };

      // Preload assets
      // ******************************
      gameFactory.preload = function(){
          // load image assets
          game.load.image('x-wing', '../assets/images/ship_x-wing.png');
          game.load.image('tie-fighter', '../assets/images/tie-fighter-pixel.png');
          game.load.image('starfield', '../assets/images/bg_starfield.png');
          game.load.image('x-wing-laser', '../assets/images/ship_x-wing-laser.png');
      };


      // Create game
      // ******************************
      gameFactory.create = function(){
          var world = game;

          // add scrolling space background
          starfield = game.add.tileSprite(0, 0, world.width, world.height, 'starfield');

          // player bullets
          xwingLaser = game.add.group();
          xwingLaser.enableBody = true;
          xwingLaser.physicsBodyType = Phaser.Physics.ARCADE;
          xwingLaser.createMultiple(3, 'x-wing-laser');
          xwingLaser.setAll('anchor.x', 0.5);
          xwingLaser.setAll('anchor.y', 2.5);
          xwingLaser.setAll('outOfBoundsKill', true);
          xwingLaser.setAll('checkWorldBounds', true);


          // set player as xwing pilot
          player =  game.add.sprite(400,500, 'x-wing');
          player.anchor.setTo(0.5,0.5);

          // enable player movement
          game.physics.enable(player, Phaser.Physics.ARCADE);
          player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
          player.body.drag.setTo(DRAG, DRAG);
          // add controls for user
          cursor = game.input.keyboard.createCursorKeys();
          fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      };

      // Update the game
      // ******************************
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

        // check for laser event
        if(fireButton.isDown){
          fireLaser();
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


      // Shoot the laser
      // ******************************
      function fireLaser() {

        if(game.time.now > nextFire && xwingLaser.countDead() > 0){
          nextFire = game.time.now + fireRate;
          var laser = xwingLaser.getFirstDead();

          laser.reset(player.x, player.y + 8);
          laser.body.velocity.y = -LASER_VELOCITY;

        }
        // var laser = xwingLaser.getFirstExists(false);
        //
        // if (laser) {
        //   laser.reset(player.x, player.y + 8);
        //   laser.body.velocity.y = -LASER_VELOCITY;
        // }
      }

      return gameFactory;

    });
}());
