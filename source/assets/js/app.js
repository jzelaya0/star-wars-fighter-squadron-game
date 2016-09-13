// source/assets/js/app.js
(function() {
  'use strict';

  angular
    .module('swfsGameApp', [
      'appRoutes',
      'mainCtrl',
      'loginCtrl',
      'gameCtrl',
      'profileCtrl',
      'editProfileCtrl',
      'alertService',
      'authService',
      'userService',
      'gameService',
      'gameBootService',
      'gameLoadService',
      'gameMenuService',
      'gamePlayService',
      'playerStatsService',
      'signUpCtrl',
      'ui.bootstrap',
      'ngMessages',
      'ngAnimate'
    ])

    .config(function($httpProvider){
      // attach AuthInterceptor to requests
      $httpProvider.interceptors.push('AuthInterceptor');
    });
}());
