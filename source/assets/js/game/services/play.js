// source/assets/js/game/services/play.js

(function() {
  'use strict';

  angular.module('gamePlayService',[])
  .factory('playState', function(){
    var playFactory = {};
    //GAME VARIABLES
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
    var healthUp;
    var healthUpFx;
    var healthLaunchTimer;
    var pause = false;
    var pauseLabel;
    // Player ship settings
    var LASER_VELOCITY = 700;
    var ACCELERATION = 700;
    var DRAG = 500;
    var MAX_SPEED = 400;
    // Enemy ship settings
    var tieFighterDeployTime = 3000;
    var tieFighterSpeed = 300;


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
      //pause
      pause = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      pause.onDown.add(playFactory.togglePause,this);
      // Sound Effects
      xwingFx = game.add.audio('xwingFx');
      tieFighterFx = game.add.audio('tieFighterFx');
      kaboomFx = game.add.audio('kaboomFx');
      healthUpFx = game.add.audio('heartFX');
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
      // Heart containers
      healthUp = game.add.group();
      healthUp.enableBody = true;
      healthUp.physicsBodyType = Phaser.Physics.ARCADE;
      healthUp.createMultiple(5, 'heart');
      healthUp.setAll('anchor.x', 0.5);
      healthUp.setAll('anchor.y', 0.5);
      healthUp.setAll('outOfBoundsKill', true);
      healthUp.setAll('checkWorldBounds', true);
      game.time.events.add(1000, this.deployHearts);

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
        fill: '#4caf50',
        fontWeight: 'bold'
      });
      shields.render = function(){
        shields.text = 'Shields ' + Math.max(player.health, 0 ) + "%";
        if (player.health >= 100) {
          shields.addColor('#4caf50', 0);
        }else if (player.health === 60) {
          shields.addColor('#fff000', 0);
        }else if (player.health === 40) {
          shields.addColor('#ff0000', 0);
        }
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

      // Game pause display
      pauseLabel = game.add.text(game.world.centerX, game.world.centerY, 'PAUSED\nPress ENTER to Start', {
        font: '50px Arial',
        fill: '#f44336',
        fontWeight: 'bold',
        align: 'center',
        shadowColor: '#444',
        shadowFill: true,
        shadowOffsetY: 5
      });
      pauseLabel.anchor.set(0.5);
      pauseLabel.visible = false;
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
      game.physics.arcade.overlap(player, healthUp, this.healPlayer, null, this); // heart collision with player

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

      var imperial = enemies.getFirstExists(false);
      if (imperial) {
        var laserSpeed = tieFighterSpeed + 100;
        var firingDelay = 1000;
        imperial.lasers = 1 ;
        imperial.lastShot = 0;

        imperial.reset(game.rnd.integerInRange(0, game.width), -20);
        imperial.body.velocity.x = game.rnd.integerInRange(-200, 200);
        imperial.body.velocity.y = tieFighterSpeed;
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
      enemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(500, tieFighterDeployTime), playFactory.deployEnemies);
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

      // Show damabe amount on player
      score += enemy.damageAmount * 10;
      scoreText.render();

      //Check player score for game pacing
      this.setGameDifficulty();
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

    // Heart & player collison
    // ******************************
    playFactory.healPlayer = function(player, heart){
      heart.reset(player.body.x, player.body.y);
      heart.kill();
      player.health  = 100;
      healthUpFx.play();
      shields.render();
    };


    // Deploy heart container
    // ******************************
    playFactory.deployHearts = function(){
      var game = playFactory.game;
      var HEART_SPEED = 300;
      var DEPLOY_DELAY = 5000;

      var heart = healthUp.getFirstExists(false);
      // Launch only if player health is low
      if (heart && player.health <= 40 && player.alive) {
        heart.reset(game.rnd.integerInRange(0, game.width), -10);
        heart.body.velocity.y = HEART_SPEED;
      }

      // Launch health containers
      healthLaunchTimer = game.time.events.add(DEPLOY_DELAY, playFactory.deployHearts);

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

      // Reset game difficulty
      tieFighterDeployTime = 3000;
      tieFighterSpeed = 300;

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

    // Toggle pause
    // ******************************
    playFactory.togglePause = function(){
      var game = this.game;
      pauseLabel.visible = !pauseLabel.visible;
      game.paused = !game.paused;
    };

    // Set game difficulty
    // ******************************
    playFactory.setGameDifficulty = function(){
      switch (score) {
        case 2000:
          tieFighterDeployTime = 2500;
          tieFighterSpeed = 325;
          break;
        case 4000:
          tieFighterDeployTime = 2000;
          tieFighterSpeed = 350;
          break;
        case 6000:
          tieFighterDeployTime = 1500;
          tieFighterSpeed = 400;
          break;
        case 8000:
          tieFighterDeployTime = 1000;
          break;
      }
    };

    return playFactory;
  });

}());
