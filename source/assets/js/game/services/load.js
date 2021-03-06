// source/assets/js/game/services/load.js

(function() {
  'use strict';

  angular.module('gameLoadService',[])
  .factory('loadState', function(){
    var loadFactory = {};

    // Preload game assets
    // ******************************
    loadFactory.preload = function(game) {
      // load image assets
      game.load.image('starfield', '../assets/images/bg_starfield.png');
      game.load.image('x-wing', '../assets/images/ship_x-wing.png');
      game.load.image('x-wing-laser', '../assets/images/ship_x-wing-laser.png');
      game.load.image('tie-fighter', '../assets/images/ship_tie-fighter.png');
      game.load.spritesheet('kaboom', '../assets/images/sprite_explosion.png', 128, 128);
      game.load.image('tie-fighter-laser', '../assets/images/ship_tie-fighter-laser.png');
      game.load.image('heart', '../assets/images/sprite_heart.png');
      game.load.image('asteroid', '../assets/images/sprite_asteroid.png');

      // load audio assets
      game.load.audio('bgMusic', '../assets/audio/song_starwars_remix.mp3');
      game.load.audio('mainThemeMusic', '../assets/audio/song_main-theme.mp3');
      game.load.audio('xwingFx', '../assets/audio/sound_xwing-gun.mp3');
      game.load.audio('tieFighterFx', '../assets/audio/sound_tie-fighter-gun.mp3');
      game.load.audio('kaboomFx', '../assets/audio/sound_explosion.mp3');
      game.load.audio('heartFX', '../assets/audio/sound_heart.mp3');

      // Show loading text
      this.showLoadingText();
    };

    // Create Menu state
    // ******************************
    loadFactory.showLoadingText = function(){
      var game = this.game;
      var loadingText = game.add.text(game.world.centerX, game.world.centerY, 'Loading...', {
        font: '40px Arial',
        fill: 'rgb(75, 213, 238)'
      });
      loadingText.anchor.set(0.5);
      loadingText.alpha = 0;
      var loadingTweenIn = game.add.tween(loadingText).to({ alpha: 1 }, 500, Phaser.Easing.Linear.Out);
      loadingTweenIn.start();
    };

    // Create Menu state
    // ******************************
    loadFactory.create = function(game){
      game.time.events.add(1000, function(){
        game.state.start('menu');
      });
    };

    // return loadFactory
    return loadFactory;
  });

}());
