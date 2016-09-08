// source/assets/js/game/services/boot.js

(function() {
  'use strict';

  angular.module('gameBootService',[])
  .factory('bootState', function(){
    var bootFactory = {};

    // Game boot
    // ******************************
    bootFactory.create = function(game) {
      // Set global variables for all states
      game.global = {
        score: 0,
        kills: 0,
        fireRate: 100,
        nextFire: 0,
        laserVelocity: 700,
        acceleration: 800,
        drag: 300,
        maxspeed: 400,
        tieFighterDeployTime: 3000,
        tieFighterSpeed: 300,
        asteroidDeployTime: 3000
      };
      // Start the phsyics system
      game.physics.startSystem(Phaser.Physics.ARCADE);

      //call the load state
      game.state.start('load');
    };

    return bootFactory;
  });
}());
