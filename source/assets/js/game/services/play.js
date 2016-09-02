// source/assets/js/game/services/play.js

(function() {
  'use strict';

  angular.module('gamePlayService',[])
  .factory('playState', function(){
    var playFactory = {};
    //GAME VARIABLES
    var starfield;
    var game = playFactory.game;
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
    var enemyLaunchTimer;
    var gameover;
    var tapRestart;
    var spaceRestart;
    var score = 0;
    var scoreText;
    var enemyLaser;
    var tieFighterLaser;
    var music;
    var xwingFx;
    var tieFighterFx;
    var kaboomFx;
    var LASER_VELOCITY = 700;
    var ACCELERATION = 700;
    var DRAG = 500;
    var MAX_SPEED = 400;


    // ================================================================================
    // GAME CREATE
    // ================================================================================
    playFactory.create = function(game){
      // Game Settings
      // ******************************
      var world = game;
      // Game background
      starfield = game.add.tileSprite(0, 0, world.width, world.height, 'starfield');
      // Play background music
      music = game.add.audio('bgMusic');
      music.loop = true;
      music.play();
      // Sound Effects
      xwingFx = game.add.audio('xwingFx');
      tieFighterFx = game.add.audio('tieFighterFx');
      kaboomFx = game.add.audio('kaboomFx');
      // Explosion pool
      explosions = game.add.group();
      explosions.enableBody = true;
      explosions.physicsBodyType = Phaser.Physics.ARCADE;
      explosions.createMultiple(30, 'kaboom');
      explosions.setAll('anchor.x', 0.5);
      explosions.setAll('anchor.y', 0.5);
      explosions.forEach(function(explosion){
        explosion.animations.add('kaboom');
      });
      // Player Settings
      // ******************************
      //Player is set as XWing Pilot
      player = game.add.sprite(400, 500, 'x-wing');
      player.health = 100;
      player.anchor.setTo(0.5, 0.5);
      // Set velocity and drag for player
      game.physics.enable(player, Phaser.Physics.ARCADE);
      player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
      player.body.drag.setTo(DRAG, DRAG);
      // Player controls
      cursor = game.input.keyboard.createCursorKeys();
      fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      // Player lasers
      xwingLaser = game.add.group();
      xwingLaser.enableBody = true;
      xwingLaser.physicsBodyType = Phaser.Physics.ARCADE;
      xwingLaser.createMultiple(3, 'x-wing-laser');
      xwingLaser.setAll('anchor.x', 0.5);
      xwingLaser.setAll('anchor.y', 2.5);
      xwingLaser.setAll('outOfBoundsKill', true);
      xwingLaser.setAll('checkWorldBounds', true);
      // Enemy Settings
      // ******************************
      // Create Tie fighters
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
      // Deploy Tie Fighters
      game.time.events.add(1000, this.deployEnemies);
      // Tie Fighter lasers
      tieFighterLaser = game.add.group();
      tieFighterLaser.enableBody = true;
      tieFighterLaser.physicsBodyType = Phaser.Physics.ARCADE;
      tieFighterLaser.createMultiple(3, 'tie-fighter-laser');
      tieFighterLaser.setAll('anchor.x', 0.5);
      tieFighterLaser.setAll('anchor.y', 0);
      tieFighterLaser.setAll('outOfBoundsKill', true);
      tieFighterLaser.setAll('checkWorldBounds', true);
      // Game Text
      // ******************************
      // Shield stats to display
      shields = game.add.text(10, 10, 'Shields: ' + player.health + '%', {
        font: '20px Arial',
        fill: '#eee',
        fontWeight: 'bold'
      });
      shields.render = function(){
        shields.text = 'Shields ' + Math.max(player.health, 0 ) + "%";
      };

      // Score display
      scoreText = game.add.text(game.world.width - 150, 10, '', {
        font: '20px Arial',
        fill: '#ffc107',
        fontWeight: 'bold'
      });

      scoreText.render = function(){
        scoreText.text = 'Score: ' + score;
      };

      scoreText.render();

      // Game over display
      gameover = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
        font: '80px Arial',
        fill: '#ffeb3b',
        fontWeight: 'bold'
      });
      gameover.anchor.setTo(0.5, 0.5);
      gameover.visible = false;

    };

    // ================================================================================
    // GAME UPDATE
    // ================================================================================
    playFactory.update = function(game){
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
        this.fireLaser();
      }
      // Set boundries on player
      if(player.x > game.width - 40){
        player.x = game.width - 40;
        player.body.acceleration.x = 0;
      }
      if (player.x < 40) {
        player.x = 40;
        player.body.acceleration.x = 0;
      }
      // Bank the ship's movement
      bank = player.body.velocity.x / MAX_SPEED;
      player.scale.x = 1 - Math.abs(bank) / 10;
      player.angle = bank * 10;
      // Collision detection
      game.physics.arcade.overlap(player, enemies, this.shipCollide, null, this); // ship collision
      game.physics.arcade.overlap(enemies, xwingLaser, this.shootEnemy, null, this); // bullet collion on enemies
      game.physics.arcade.overlap(tieFighterLaser, player, this.enemyHitsPlayer, null, this); // bullet collision on player
      // Check if game is over
      if(!player.alive && gameover.visible === false){
        gameover.visible = true;

        var fadeInGameOver = game.add.tween(gameover);
        fadeInGameOver.to({aplpha: 1}, 1000, Phaser.Easing.Quintic.Out);
        fadeInGameOver.onComplete.add(playFactory.setResetHandlers);
        fadeInGameOver.start();
      }

    };

    // ================================================================================
    // GAME HANDLERS
    // ================================================================================

    // Shoot the laser
    // ******************************
    playFactory.fireLaser = function() {
      var game = playFactory.game;

      if(game.time.now > nextFire && xwingLaser.countDead() > 0){
        nextFire = game.time.now + fireRate;
        var laser = xwingLaser.getFirstDead();

        laser.reset(player.x, player.y + 8);
        laser.body.velocity.y = -LASER_VELOCITY;
        xwingFx.play();
      }
    };
    // Deploy enemies
    // ******************************
    playFactory.deployEnemies = function() {
      var game = playFactory.game;
      // Speed and spacing setttings for imperials
      var MIN_ENEMY_SPACING = 500;
      var MAX_ENEMY_SPACING = 1000;
      var ENEMY_SPEED = 400;

      var imperial = enemies.getFirstExists(false);
      if (imperial) {
        var laserSpeed = 500;
        var firingDelay = 1000;
        imperial.lasers = 1 ;
        imperial.lastShot = 0;

        imperial.reset(game.rnd.integerInRange(0, game.width), -20);
        imperial.body.velocity.x = game.rnd.integerInRange(-200, 200);
        imperial.body.velocity.y = ENEMY_SPEED;
        imperial.body.drag.x = 100;

        // Allow ships to have a bit of rotation
        imperial.update = function(){
          imperial.angle = 180 - game.math.radToDeg(Math.atan2(imperial.body.velocity.x, imperial.body.velocity.y));

          //  Fire laser
          enemyLaser = tieFighterLaser.getFirstExists(false);
          if (enemyLaser && this.alive && this.lasers && game.time.now > firingDelay + this.lastShot) {
                this.lastShot = game.time.now;
                this.lasers--;
                enemyLaser.reset(this.x, this.y);
                enemyLaser.damageAmount = this.damageAmount;
                enemyLaser.body.velocity.y = laserSpeed;
                tieFighterFx.play();
            }

        };
      }
      // keep the imperials coming!
      enemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), playFactory.deployEnemies);
    };
    //
    // Ship collision detection
    // ******************************
      playFactory.shipCollide = function(player, enemy) {
      var explosion = explosions.getFirstExists(false);
      explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
      explosion.body.velocity.y = enemy.body.velocity.y;
      explosion.alpha = 0.7;
      explosion.play('kaboom', 30, false, true);
      kaboomFx.play();
      enemy.kill();

      player.damage(enemy.damageAmount);
      shields.render();
    };

    // Enemy hit by player
    // ******************************
      playFactory.shootEnemy = function(enemy, laser) {
      var explosion = explosions.getFirstExists(false);

      explosion.reset(laser.body.x + laser.body.halfWidth, laser.body.y + laser.body.halfHeight);
      explosion.body.velocity.y = enemy.body.velocity.y;
      explosion.alpha = 0.7;
      explosion.play('kaboom', 30, false, true);
      kaboomFx.play();
      enemy.kill();
      laser.kill();

      score += enemy.damageAmount * 10;
      scoreText.render();
    };

    // Enemy shoots player
    // ******************************
    playFactory.enemyHitsPlayer = function (player, bullet) {
      var explosion = explosions.getFirstExists(false);
      explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
      explosion.play('kaboom', 30, false, true);
      kaboomFx.play();
      bullet.kill();

      player.damage(bullet.damageAmount);
      shields.render();
    };

    // Restart game
    // ******************************
    playFactory.resetGame = function(){
      var game = playFactory.game;
      enemies.callAll('kill');
      game.time.events.remove(enemyLaunchTimer);
      game.time.events.add(1000, this.deployEnemies);
      tieFighterLaser.callAll('kill');

      // bring the player back to life
      player.revive();
      player.health = 100;
      shields.render();
      score = 0;
      scoreText.render();

      // hide game over text
      gameover.visible = false;

    };

    // Reset handlers
    // ******************************
    playFactory.setResetHandlers = function(){
      var game = playFactory.game;
      // click for restart
      tapRestart = game.input.onTap.addOnce(setRestart,this);
      spaceRestart = fireButton.onDown.addOnce(setRestart, this);

      function setRestart (){
        tapRestart.detach();
        spaceRestart.detach();
        playFactory.resetGame();
      }
    };

    return playFactory;
  });

}());