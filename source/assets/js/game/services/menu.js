// source/assets/js/game/services/menu.js

(function() {
  'use strict';

  angular.module('gameMenuService',[])
  .factory('menuState', function(){
    var menuFactory = {};
    var themeMusic;
    var starfield;

    // Main menu
    // ******************************
    menuFactory.create = function(game){
        starfield = game.add.tileSprite(0, 0, game.width, game.height, 'starfield');
        themeMusic = game.add.audio('mainThemeMusic');

        // key press to start game
        var enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        enterKey.onDown.addOnce(start, this);

        //start the game
        function start(){
          // Stop themeMusic
          themeMusic.pause();
          return game.state.start('play');
        }

        //Play theme music
        this.playThemeMusic();
        this.openTitle();
        this.startGameText();
    };

    // Play opening music
    // ******************************
    menuFactory.playThemeMusic  = function(){
      themeMusic.play();
    };

    // Title Crawl
    // ******************************
    menuFactory.openTitle = function(){
      var game = this.game;
      //Game title
      var gameTitle = game.add.text(game.world.centerX, 250, 'Star Wars\nFighter Squadron', {
        font: '50px sf_distant_galaxyregular',
        fill: '#000',
        stroke: '#ffc107',
        strokeThickness: 10
      });
      gameTitle.anchor.set(0.5);
      gameTitle.align = 'center';
      //Game title crawl in
      gameTitle.anchor.setTo(0.5, 0.5);
      gameTitle.scale.setTo(1.5, 1.5);
      var positionTween = game.add.tween(gameTitle).to({ y: '-40' }, 14000, Phaser.Easing.Linear.Out, true);
      var gameTitleTween = game.add.tween(gameTitle.scale).to({ x: 0, y: 0 }, 5000, Phaser.Easing.Linear.Out, true);
      var opacityTween = game.add.tween(gameTitle).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.In, true, 10500);
    };

    // Flash start game text
    // ******************************
    menuFactory.startGameText = function(){
      var game = this.game;
      // Instructions to start game
      var startText = game.add.text(game.world.centerX, game.world.centerY, 'Press ENTER to start', {
        font: '40px Arial',
        fill: '#ffc107'
      });
      startText.anchor.set(0.5);
      startText.alpha = 0;
      var starTween = game.add.tween(startText).to({ alpha: 1 }, 500, Phaser.Easing.Linear.Out, true, 5000, -1 );
      starTween.yoyo(true, 200);
    };

    return menuFactory;
  });
}());
