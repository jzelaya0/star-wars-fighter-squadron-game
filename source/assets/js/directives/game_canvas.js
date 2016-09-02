// source/assets/js/directives/game_canvas.js
(function() {
  'use strict';

  angular
    .module('swfsGameApp')
      .directive('gameCanvas', function($rootScope, Game){

      return {
        scope: {
          players: '='
        },
        restrict: 'A',
        link: function(scope){
          // intialize the game
          var game;
          Game.init();

          // On route change, invoke the destory method
          scope.$on('$destroy', function(){
            console.log(Game.removeGame());
          });
        }
      };

    });
}());
