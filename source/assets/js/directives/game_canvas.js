// source/assets/js/directives/game_canvas.js
(function() {
  'use strict';

  angular
    .module('swfsGameApp')
      .directive('gameCanvas', function($injector, Game){

      return {
        scope: {
          players: '='
        },
        restrict: 'A',
        link: function(){
          // intialize the game
          Game.init();
        }
      };

    });
}());
