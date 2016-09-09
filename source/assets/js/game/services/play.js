// source/assets/js/game/services/play.js

(function() {
  'use strict';

  angular.module('gamePlayService',[])
  .factory('playState', function(PlayerStats){
    var playFactory = {};
    //GAME VARIABLES
    // var starfield;
    var player;
    var scoreText;
    var cursor;
    var bank;
    var xwingLaser;
    var fireButton;
    var enemies;
    var explosions;
    var shields;
    var gameover;
    var tapRestart;
    var spaceRestart;
    var enemyLaser;
    var tieFighterLaser;
    var music;
    var xwingFx;
    var tieFighterFx;
    var kaboomFx;
    var healthUp;
    var healthUpFx;
    var pause;
    var pauseLabel;
    var asteroids;



    // ================================================================================
    // GAME CREATE
    // ================================================================================
    playFactory.create = function(game){
      var g = game.global;
      // Game Settings
      // ******************************
      var world = game;
      // Game background
      g.starfield = game.add.tileSprite(0, 0, world.width, world.height, 'starfield');
      // Play background music
      music = game.add.audio('bgMusic');
      music.loop = true;
      game.time.events.add(1000, function(){
        music.play();
      });
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
      // Asteroids
      asteroids = game.add.group();
      asteroids.enableBody = true;
      asteroids.physicsBodyType = Phaser.Physics.ARCADE;
      asteroids.createMultiple(15, 'asteroid');
      asteroids.setAll('anchor.x', 0.5);
      asteroids.setAll('anchor.y', 0.5);
      asteroids.setAll('outOfBoundsKill', true);
      asteroids.setAll('checkWorldBounds', true);
      asteroids.forEach(function(asteroid){
        asteroid.damageAmount = 20;
      });

      // Player Settings
      // ******************************
      //Player is set as XWing Pilot
      player = game.add.sprite(400, 500, 'x-wing');
      player.health = 100;
      player.anchor.setTo(0.5, 0.5);
      // Set velocity and drag for player
      game.physics.enable(player, Phaser.Physics.ARCADE);
      player.body.maxVelocity.setTo(g.maxspeed, g.maxspeed);
      player.body.drag.setTo(g.drag, g.drag);
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
      // Enemy damage
      enemies.forEach(function(enemy){
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
        scoreText.text = 'Score: ' + g.score;
      };

      scoreText.render();

      // Game over display
      gameover = game.add.text(game.world.centerX, game.world.centerY, 'Game Over', {
        font: '80px sf_distant_galaxyregular',
        stroke: '#ffeb3b',
        fill: '#000',
        strokeThickness: 10,
        align: 'center'
      });
      gameover.anchor.setTo(0.5, 0.5);
      gameover.visible = false;

      // Game pause display
      pauseLabel = game.add.text(game.world.centerX, game.world.centerY, 'PAUSED\nPress ENTER to Start', {
        font: '30px Arial',
        fill: 'rgb(75, 213, 238)',
        fontWeight: 'bold',
        align: 'center',
        shadowColor: '#000',
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
      var g = game.global;
      // Scroll the background
      g.starfield.tilePosition.y += 2;
      //Reset player and then check if there is any movement
      player.body.acceleration.x = 0;
      // move the player left or right
      if (cursor.left.isDown) {
        player.body.acceleration.x = -g.acceleration;
      }else if (cursor.right.isDown) {
        player.body.acceleration.x = g.acceleration;
      }
      // check for laser event
      if(player.alive && fireButton.isDown){
        this.fireLaser();
      }
      // Set boundries on player
      if(player.x > game.width - 40){
        player.x = game.width - 40;
        player.body.velocity.x = 0;
      }
      if (player.x < 40) {
        player.x = 40;
        player.body.velocity.x = 0;
      }
      // Bank the ship's movement
      bank = player.body.velocity.x / g.maxspeed;
      player.scale.x = 1 - Math.abs(bank) / 10;
      player.angle = bank * 10;

      // Collision detection
      game.physics.arcade.overlap(player, enemies, this.shipCollide, null, this); // ship collision
      game.physics.arcade.overlap(enemies, xwingLaser, this.hitByPlayer, null, this); // bullet collion on enemies
      game.physics.arcade.overlap(tieFighterLaser, player, this.enemyHitsPlayer, null, this); // bullet collision on player
      game.physics.arcade.overlap(player, healthUp, this.healPlayer, null, this); // heart collision with player
      game.physics.arcade.overlap(player, asteroids, this.shipCollide, null, this); // asteroids collision with player
      game.physics.arcade.overlap(asteroids, xwingLaser, this.hitByPlayer, null, this); // bullet collision on asteroids

      // Check if game is over
      if(!player.alive && gameover.visible === false){
        gameover.visible = true;
        gameover.alpha = 0;
        var fadeInGameOver = game.add.tween(gameover);
        fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);
        fadeInGameOver.onComplete.add(playFactory.setResetHandlers);
        fadeInGameOver.start();

        // Set score and kills
        var stats = {
          score: g.score,
          kills: g.kills
        };
        // Set player score and kills;
        PlayerStats.setPlayerStats(stats);
        //rotate aseteroid
      }
    };
    // ================================================================================
    // GAME RENDER
    // ================================================================================

    // // Debug ships
    // // ******************************
    // playFactory.render = function(game){
    //   // Debug enemies
    //   for (var i = 0; i < enemies.length; i++) {
    //     game.debug.body(enemies.children[i]);
    //   }
    //   // Debug enemy lasers/
    //   for (var j = 0; j < tieFighterLaser.length; j++) {
    //     game.debug.body(tieFighterLaser.children[j]);
    //   }
    //   // Debug asteroids
    //   for (var a = 0; a< asteroids.length; a++) {
    //     game.debug.body(asteroids.children[a]);
    //   }
    //   // Debug player
    //   game.debug.body(player);
    //   for (var x = 0; x < xwingLaser.length; x++) {
    //     game.debug.body(xwingLaser.children[x]);
    //   }
    // };

    // ================================================================================
    // GAME HANDLERS
    // ================================================================================

    // Shoot the laser
    // ******************************
    playFactory.fireLaser = function() {
      var game = this.game;
      var g = game.global;

      if(game.time.now > g.nextFire && xwingLaser.countDead() > 0){
        g.nextFire = game.time.now + g.fireRate;
        var laser = xwingLaser.getFirstDead();

        laser.reset(player.x, player.y + 8);
        laser.body.velocity.y = -g.laserVelocity;
        xwingFx.play();
      }
    };

    // ==============================
    // Deploys
    // ==============================

    // Deploy enemies
    // ******************************
    playFactory.deployEnemies = function() {
      var game = playFactory.game;
      var g = game.global;

      var imperial = enemies.getFirstExists(false);
      if (imperial) {
        var laserSpeed = g.tieFighterSpeed + 100;
        var firingDelay = 1000;
        imperial.lasers = 1 ;
        imperial.lastShot = 0;

        imperial.reset(game.rnd.integerInRange(0, game.width), -20);
        imperial.body.velocity.x = game.rnd.integerInRange(-g.tieFighterSpeed, g.tieFighterSpeed);
        imperial.body.velocity.y = g.tieFighterSpeed;
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
      g.enemyLaunchTimer = game.time.events.add(game.rnd.integerInRange(500, g.tieFighterDeployTime), playFactory.deployEnemies);
    };

    // Deploy heart container
    // ******************************
    playFactory.deployHearts = function(){
      var game = playFactory.game;
      var g = game.global;
      var HEART_SPEED = 300;
      var DEPLOY_DELAY = 5000;

      var heart = healthUp.getFirstExists(false);
      // Launch only if player health is low
      if (heart && player.health <= 40 && player.alive) {
        heart.reset(game.rnd.integerInRange(0, game.width), -10);
        heart.body.velocity.y = HEART_SPEED;
      }

      // Launch health containers
      g.healthLaunchTimer = game.time.events.add(DEPLOY_DELAY, playFactory.deployHearts);

    };

    // Deploy asteroids
    // ******************************
    playFactory.deployAsteroids = function(){
      var game = playFactory.game;
      var g = game.global;
      var ASTEROID_SPEED = 250;

      var asteroid = asteroids.getFirstExists(false);
      if(asteroid && player.alive){
        asteroid.reset(game.rnd.integerInRange(0, game.width), -20);
        asteroid.body.velocity.x = game.rnd.integerInRange(-ASTEROID_SPEED, ASTEROID_SPEED);
        asteroid.body.velocity.y = ASTEROID_SPEED;
      }

      // Rotate asteroid
      asteroid.update = function(){
        asteroid.angle += 5;
      };

      // Launch asteroids
      g.asteroidLaunchTimer = game.time.events.add(g.asteroidDeployTime, playFactory.deployAsteroids);

    };

    // ==============================
    // COLLISIONS
    // ==============================

    // Player ship collides with enemy or asteroid
    // ******************************
    playFactory.shipCollide = function(player, obj) {
      var explosion = explosions.getFirstExists(false);
      explosion.reset(obj.body.x + obj.body.halfWidth, obj.body.y + obj.body.halfHeight);
      explosion.body.velocity.y = obj.body.velocity.y;
      explosion.alpha = 0.7;
      explosion.play('kaboom', 30, false, true);
      kaboomFx.play();
      obj.kill();

      player.damage(obj.damageAmount);
      shields.render();
    };

    // Enemy or Asteroid shot by player
    // ******************************
    playFactory.hitByPlayer = function(obj, laser) {
      var g = this.game.global;
      var explosion = explosions.getFirstExists(false);

      explosion.reset(laser.body.x + laser.body.halfWidth, laser.body.y + laser.body.halfHeight);
      explosion.body.velocity.y = obj.body.velocity.y;
      explosion.alpha = 0.7;
      explosion.play('kaboom', 30, false, true);
      kaboomFx.play();
      obj.kill();
      laser.kill();

      // Show damabe amount on player
      g.score += obj.damageAmount * 10;
      scoreText.render();

      //Check player score for game pacing
      this.setGameDifficulty();

      // Increase enemy kills;
      if (obj.key === 'tie-fighter') {
        g.kills ++;
      }
    };

    // Player shot by enemy
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


    // ==============================
    // GAME SETTINGS
    // ==============================

    // Restart game
    // ******************************
    playFactory.resetGame = function(){
      var game = this.game;
      var g = game.global;
      enemies.callAll('kill');
      game.time.events.remove(g.enemyLaunchTimer);
      game.time.events.remove(g.asteroidLaunchTimer);
      game.time.events.remove(this.deployAsteroids);
      game.time.events.add(1000, this.deployEnemies);
      tieFighterLaser.callAll('kill');

      // bring the player back to life
      player.revive();
      player.health = 100;
      shields.render();
      g.score = 0;
      scoreText.render();

      // Reset game difficulty
      g.tieFighterDeployTime = 3000;
      g.tieFighterSpeed = 300;
      g.asteroidDeployTime = 3000;

      // hide game over text
      gameover.visible = false;

      // reset kills
      g.kills = 0;

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
      var game = this.game;
      var g = game.global;
      switch (g.score) {
        case 2000:
          g.tieFighterDeployTime = 2500;
          g.tieFighterSpeed = 325;
          // Launch asteroids
          game.time.events.add(1000, this.deployAsteroids);
          break;
        case 4000:
          g.tieFighterDeployTime = 2000;
          g.tieFighterSpeed = 350;
          g.asteroidDeployTime = 2500;
          break;
        case 6000:
          g.tieFighterDeployTime = 1500;
          g.tieFighterSpeed = 400;
          g.asteroidDeployTime = 2000;
          break;
        case 8000:
          g.tieFighterDeployTime = 1000;
          g.asteroidDeployTime = 1000;
          break;
      }
    };

    return playFactory;
  });

}());
