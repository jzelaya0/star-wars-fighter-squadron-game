// source/assets/js/game/services/boot.js

(function() {
  'use strict';

  angular.module('gameBootService',[])
  .factory('bootState', function(){
    var bootFactory = {};

    // Game boot
    // ******************************
    bootFactory.create = function(game) {
      // Start the phsyics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //call the load state
      game.state.start('load');
    };

    return bootFactory;
  });
}());
