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
      var enemies;
      var explosions;
      var shields;
      var gameFactory = {};
      var LASER_VELOCITY = 700;
      var ACCELERATION = 700;
      var DRAG = 500;
      var MAX_SPEED = 400;


      // Initialize game
      // ******************************
      gameFactory.init = function(){
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameCanvas', {
          preload: this.preload, create: this.create , update: this.update, render: this.render
        });
      };

      // Preload assets
      // ******************************
      gameFactory.preload = function(){
          // load image assets
          game.load.image('starfield', '../assets/images/bg_starfield.png');
          game.load.image('x-wing', '../assets/images/ship_x-wing.png');
          game.load.image('x-wing-laser', '../assets/images/ship_x-wing-laser.png');
          game.load.image('tie-fighter', '../assets/images/ship_tie-fighter.png');
          game.load.image('tie-fighter-laser', '../assets/images/ship_tie-fighter-laser.png');
          game.load.spritesheet('kaboom', '../assets/images/sprite_explosion.png', 128, 128);
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
          player.health = 100;
          player.anchor.setTo(0.5,0.5);

          // enable player movement
          game.physics.enable(player, Phaser.Physics.ARCADE);
          player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
          player.body.drag.setTo(DRAG, DRAG);
          // add controls for user
          cursor = game.input.keyboard.createCursorKeys();
          fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

          // Imperial tie fighters settings
          enemies = game.add.group();
          enemies.enableBody = true;
          enemies.physicsBodyType = Phaser.Physics.ARCADE;
          enemies.createMultiple(5, 'tie-fighter');
          enemies.setAll('anchor.x', 0.5);
          enemies.setAll('anchor.y', 0.5);
          enemies.setAll('angle', 180);
          enemies.setAll('outOfBoundsKill', true);
          enemies.setAll('checkWorldBounds', true);
          // size adjustment for more accurate collisions
          enemies.forEach(function(enemy){
            enemy.body.setSize(enemy.width * 3 / 4, enemy.height * 3 / 4);
            enemy.damageAmount = 20;
          });

          deployEnemies();

          // explosions pool
          explosions = game.add.group();
          explosions.enableBody = true;
          explosions.physicsBodyType = Phaser.Physics.ARCADE;
          explosions.createMultiple(30, 'kaboom');
          explosions.setAll('anchor.x', 0.5);
          explosions.setAll('anchor.y', 0.5);
          explosions.forEach(function(explosion){
            explosion.animations.add('kaboom');
          });

          // Shield stats to display
          shields = game.add.text(10, 10, 'Shields: ' + player.health + '%', {
            font: '20px Arial',
            fill: '#eee',
            fontWeight: 'bold'
          });
          shields.render = function(){
            shields.text = 'Shields ' + Math.max(player.health, 0 ) + "%";
          };
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
        if(player.alive && fireButton.isDown){
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

        //check for collisions
        game.physics.arcade.overlap(player, enemies, shipCollide, null, this); // ship collision
        game.physics.arcade.overlap(enemies, xwingLaser, shootEnemy, null, this); // bullet collion on enemies
      };

      // Render
      // ******************************
      function render(){

        // debug for ship bounding boxes
        for (var i = 0; i < enemies.length; i++) {
          game.debug.body(enemies.children[i]);
        }
        player.debug.body(player);
      }



      // Shoot the laser
      // ******************************
      function fireLaser() {

        if(game.time.now > nextFire && xwingLaser.countDead() > 0){
          nextFire = game.time.now + fireRate;
          var laser = xwingLaser.getFirstDead();

          laser.reset(player.x, player.y + 8);
          laser.body.velocity.y = -LASER_VELOCITY;

        }
      }

      // Deploy
      // ******************************
      function deployEnemies() {
        // Speed and spacing setttings for imperials
        var MIN_ENEMY_SPACING = 500;
        var MAX_ENEMY_SPACING = 1000;
        var ENEMY_SPEED = 400;

        var imperial = enemies.getFirstExists(false);
        if (imperial) {
          imperial.reset(game.rnd.integerInRange(0, game.width), -20);
          imperial.body.velocity.x = game.rnd.integerInRange(-200, 200);
          imperial.body.velocity.y = ENEMY_SPEED;
          imperial.body.drag.x = 100;

          // Allow ships to have a bit of rotation
          imperial.update = function(){
            imperial.angle = 180 - game.math.radToDeg(Math.atan2(imperial.body.velocity.x, imperial.body.velocity.y));
          };
        }
        // keep the imperials coming!
        game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), deployEnemies);
      }

      // Ship collision detection
      // ******************************
      function shipCollide(player, enemy) {
        var explosion = explosions.getFirstExists(false);
        explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('kaboom', 30, false, true);
        enemy.kill();

        player.damage(enemy.damageAmount);
        shields.render();
      }

      // Enemy hit
      // ******************************
      function shootEnemy(enemy, laser) {
        var explosion = explosions.getFirstExists(false);

        explosion.reset(laser.body.x + laser.body.halfWidth, laser.body.y + laser.body.halfHeight);
        explosion.body.velocity.y = enemy.body.velocity.y;
        explosion.alpha = 0.7;
        explosion.play('kaboom', 30, false, true);
        enemy.kill();
        laser.kill();
      }


      return gameFactory;

    });
}());
